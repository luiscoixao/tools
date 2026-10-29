/* LIVRE AUDIO — moteur FFmpeg (WebAssembly) chargé à la demande depuis le CDN. */
const BASES = [
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd/',
  'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/'
];
let ff = null;

async function load() {
  if (ff) return true;
  let lastErr;
  for (const base of BASES) {
    try {
      const core = base + 'ffmpeg-core.js';
      importScripts(core);
      ff = await self.createFFmpegCore({
        mainScriptUrlOrBlob: core + '#' + btoa(JSON.stringify({
          wasmURL: base + 'ffmpeg-core.wasm',
          workerURL: base + 'ffmpeg-core.worker.js'
        }))
      });
      ff.setLogger(d => self.postMessage({ type: 'log', data: d }));
      return true;
    } catch (e) { lastErr = e; ff = null; }
  }
  throw lastErr || new Error('Moteur audio introuvable');
}

self.onmessage = async ({ data: { id, type, data } }) => {
  try {
    let r = true, tr = [];
    if (type !== 'load' && !ff) throw new Error('Moteur non chargé');
    switch (type) {
      case 'load': r = await load(); break;
      case 'mount': // fichiers audio lus directement, sans copie en mémoire
        try { ff.FS.unmount('/in'); } catch (e) {}
        try { ff.FS.mkdir('/in'); } catch (e) {}
        ff.FS.mount(ff.FS.filesystems.WORKERFS, { blobs: data.blobs }, '/in');
        break;
      case 'write': ff.FS.writeFile(data.path, data.data); break;
      case 'exec':
        ff.setTimeout(-1);
        ff.exec(...data.args);
        r = ff.ret;
        ff.reset();
        break;
      case 'read':
        r = ff.FS.readFile(data.path);
        if (r && r.buffer) tr = [r.buffer];
        break;
      case 'rm': try { ff.FS.unlink(data.path); } catch (e) {} break;
    }
    self.postMessage({ id, type: 'done', data: r }, tr);
  } catch (e) {
    self.postMessage({ id, type: 'error', data: String((e && e.message) || e) });
  }
};
