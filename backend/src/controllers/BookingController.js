const validatePincode = async (req, res) => {
  const { pincode } = req.params;

  // Validate pincode format
  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ error: "Invalid pincode format. Please provide a 6-digit pincode." });
  }

  try {
    const response = await fetch(`http://postalpincode.in/api/pincode/${pincode}`);

    // Check if the response is OK (status code 200)
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch data from the external API." });
    }

    const data = await response.json();


    // Return the data if everything is fine
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while fetching data. Please try again later." });
  }
};

module.exports = {validatePincode}