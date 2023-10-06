const { bookModel } = require("../models/bookModel");
const { userModel } = require("../models/userModel");

async function getRecommendations(req, res) {
  try {
    const userId = req.body.userID; // Get the user ID from the auth middleware

    // Fetch the user's borrowing history (books they have previously borrowed)
    const user = await userModel.findById(userId).populate("borrowedBooks");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Calculate user preferences based on genres or authors
    const userPreferences = calculateUserPreferences(user);

    // Generate book recommendations based on user preferences
    const recommendations = await generateRecommendations(userPreferences);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Helper function to calculate user preferences based on borrowing history
function calculateUserPreferences(user) {
  const preferences = {};

  // Loop through the user's borrowed books and update preferences
  for (const book of user.borrowedBooks) {
    const { genre, author } = book;

    // Update genre preferences
    if (genre) {
      if (preferences[genre]) {
        preferences[genre] += 1;
      } else {
        preferences[genre] = 1;
      }
    }

    // Update author preferences
    if (author) {
      if (preferences[author]) {
        preferences[author] += 1;
      } else {
        preferences[author] = 1;
      }
    }
  }

  return preferences;
}

// Helper function to generate book recommendations based on user preferences
async function generateRecommendations(userPreferences) {
  const recommendations = [];

  try {
    // Iterate through the user's preferences (genres and authors)
    for (const preference of Object.keys(userPreferences)) {
      const genreOrAuthor = preference;

      // Query the database for available books that match the genre or author
      const matchingBooks = await bookModel.find({
        $or: [{ genre: genreOrAuthor }, { author: genreOrAuthor }],
        quantity: { $gt: 0 }, // Ensure the book is available
      });

      // Add the matching books to the recommendations
      recommendations.push({
        [genreOrAuthor]: matchingBooks.map((book) => book.title),
      });
    }

    // Sort the recommendations by the number of matching books in each genre or author
    recommendations.sort((a, b) => {
      const genreA = Object.keys(a)[0];
      const genreB = Object.keys(b)[0];
      const countA = a[genreA].length;
      const countB = b[genreB].length;
      return countB - countA;
    });

    return recommendations;
  } catch (error) {
    console.error(error);
    throw new Error("Error generating recommendations");
  }
}

module.exports = { getRecommendations };
