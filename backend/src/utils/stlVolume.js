function estimateVolume(fileSizeBytes) {
  const volume = fileSizeBytes / 600;
  return Math.max(volume, 1);
}

module.exports = { estimateVolume };
