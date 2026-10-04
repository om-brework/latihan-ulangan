export function shuffle(arr){
  var a = arr.slice();
  for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; }
  return a;
}

/* Ambil n soal acak; soal dengan kelompok (g) yang sama tidak muncul bersamaan */
export function pick(pool, n){
  var seen = {}, out = [];
  shuffle(pool).forEach(function(q){
    if(out.length < n && !seen[q.g]){ seen[q.g] = true; out.push(q); }
  });
  return out;
}
