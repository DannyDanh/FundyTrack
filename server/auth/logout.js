router.post("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    
    // Destroy session
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // <-- IMPORTANT
      return res.json({ success: true });
    });
  });
});
