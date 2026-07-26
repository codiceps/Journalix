function getTopText(rank: number, totalTraders: number) {
  const percentile = totalTraders > 0 ? Math.ceil((rank / totalTraders) * 100) : 0;
  
  let topText = `Top ${percentile}%`;
  if (totalTraders === 1) {
    topText = "Peringkat Tunggal";
  }
  return topText;
}

console.log("Rank 1 out of 3:", getTopText(1, 3));
console.log("Rank 2 out of 3:", getTopText(2, 3));
console.log("Rank 3 out of 3:", getTopText(3, 3));
console.log("Rank 1 out of 1:", getTopText(1, 1));
console.log("Rank 15 out of 100:", getTopText(15, 100));
