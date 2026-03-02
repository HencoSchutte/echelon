export const getHealth = (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Echelon API",
    timestamp: new Date().toISOString(),
  })
}
