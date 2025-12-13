const BookIssue = require("../models/BookIssue");
const Book = require("../models/Book");
const Member = require("../models/Member");
const Fine = require("../models/Fine");

const calculateDueDate = () => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 2 weeks from now
  return dueDate;
};

exports.issueBook = async (req, res) => {
  try {
    const { bookId, memberId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.available <= 0) {
      return res.status(400).json({ message: "Book is not available" });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (member.status !== "active") {
      return res.status(400).json({ message: "Member account is not active" });
    }

    if (member.totalBooksCheckedOut >= member.maxBooksAllowed) {
      return res.status(400).json({
        message: "Member has reached maximum allowed books",
      });
    }

    const bookIssue = new BookIssue({
      book: bookId,
      member: memberId,
      issueDate: new Date(),
      dueDate: dueDate || calculateDueDate(),
      issuedBy: req.user.id,
      status: "issued",
    });

    await bookIssue.save();
    res.status(201).json(bookIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { condition } = req.body;

    const bookIssue = await BookIssue.findById(issueId)
      .populate("book", "title author")
      .populate("member", "name email");

    if (!bookIssue) {
      return res.status(404).json({ message: "Book issue record not found" });
    }

    if (bookIssue.status === "returned") {
      return res.status(400).json({ message: "Book already returned" });
    }

    bookIssue.returnDate = new Date();
    bookIssue.receivedBy = req.user.id;
    bookIssue.status = "returned";
    bookIssue.condition = condition || "good";

    if (bookIssue.returnDate > bookIssue.dueDate) {
      const daysOverdue = Math.ceil(
        (bookIssue.returnDate - bookIssue.dueDate) / (1000 * 60 * 60 * 24)
      );
      bookIssue.fineAmount = daysOverdue * 10; // $10 per day fine
      bookIssue.fineStatus = "pending";
    }

    await bookIssue.save();
    res.json(bookIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMemberIssues = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { status } = req.query;

    const query = { member: memberId };
    if (status) {
      query.status = status;
    }

    const issues = await BookIssue.find(query)
      .populate("book", "title author isbn")
      .populate("issuedBy", "name")
      .sort({ issueDate: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBookIssues = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { status } = req.query;

    const query = { book: bookId };
    if (status) {
      query.status = status;
    }

    const issues = await BookIssue.find(query)
      .populate("member", "name email")
      .populate("issuedBy", "name")
      .sort({ issueDate: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
