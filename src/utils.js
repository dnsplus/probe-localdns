exports.getClientIp = (req) => {
  let ipAddress;
  const forwardedIpsStr = req.headers['x-forwarded-for']; 
  if (forwardedIpsStr) {
    ipAddress = forwardedIpsStr.split(',')[0];
  }
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
}