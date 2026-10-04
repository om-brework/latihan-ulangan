export function shuffle(arr){
  var a = arr.slice();
  for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; }
  return a;
}

/* Ambil n soal acak. Soal dengan kelompok (g) yang sama tidak muncul bersamaan;
   kalau kelompoknya kurang dari n, sisanya diisi dari soal yang belum terpakai. */
export function pick(pool, n) {
  const seen = new Set(), out = [], rest = [];
  for (const q of shuffle(pool)) {
    if (out.length < n && (q.g === undefined || !seen.has(q.g))) {
      if (q.g !== undefined) seen.add(q.g);
      out.push(q);
    } else rest.push(q);
  }
  while (out.length < n && rest.length) out.push(rest.shift());
  return out;
}
