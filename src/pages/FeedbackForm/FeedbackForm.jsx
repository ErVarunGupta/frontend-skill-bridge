import React, { useEffect, useState } from "react";
import "./FeedbackForm.css";
import { getUserProfile } from "../../api/authApi";
import { useNavigate, useParams } from "react-router-dom";
import { updateRating } from "../../api/feedbackApi";
import { completeReqeust, getRequestById } from "../../api/helpApi";


function Star({ filled, onClick, onMouseEnter, onMouseLeave, label }) {
  return (
    <button
      type="button"
      className={`star ${filled ? "filled" : ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={label}
    >
      ★
    </button>
  );
}

export default function FeedbackForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [request, setRequest] = useState(null);

  const COMMENT_MAX = 1000;

  const { requestId } = useParams();

  useEffect(() => {
    const fetchRequest = async () => {
      if (requestId) {
        const res = await getRequestById({ requestId });
        if (res?.success) {
          setRequest(res.request);
        }
      }
    };
    fetchRequest();
  }, [requestId]);

  const helperId = request?.helperId._id;

//   console.log(request);

  const validate = () => {
    const e = {};
    if (!rating) e.rating = "Please give a rating.";
    if (!comment.trim()) e.comment = "Please write your feedback.";
    if (comment.length > COMMENT_MAX)
      e.comment = `Max ${COMMENT_MAX} characters allowed.`;
    if (email && !/^\S+@\S+\.\S+$/.test(email))
      e.email = "Enter a valid email.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setRating(0);
    setHoverRating(0);
    setComment("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      name: name.trim() || "Anonymous",
      email: email.trim() || null,
      comment: comment.trim(),
      title: request?.title,
      description: request?.description,
      createdAt: new Date().toISOString(),
    };

    try {
      const feedback = {
        rating,
        comment: payload,
      };
      completeReqeust(request._id);
      updateRating({ helperId, feedback });
      alert("Thank you for your feedback!");
      resetForm();
      navigate("/dashboard/home");
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      <h2 className="ff-title">Send Feedback</h2>

      <div className="ff-row">
        <label htmlFor="ff-name">Name (optional)</label>
        <input
          id="ff-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div className="ff-row">
        <label htmlFor="ff-email">Email (optional)</label>
        <input
          id="ff-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        {errors.email && <div className="ff-error">{errors.email}</div>}
      </div>

      <div className="ff-row">
        <label>Rating *</label>
        <div className="ff-stars" role="radiogroup">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              filled={i <= (hoverRating || rating)}
              onClick={() => setRating(i)}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
              label={`${i} star${i > 1 ? "s" : ""}`}
            />
          ))}
        </div>
        {errors.rating && <div className="ff-error">{errors.rating}</div>}
      </div>

      <div className="ff-row">
        <label htmlFor="ff-comment">Comments *</label>
        <textarea
          id="ff-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={6}
          maxLength={COMMENT_MAX}
          placeholder="Write your feedback..."
        />
        <div className="ff-meta">
          <span>
            {comment.length}/{COMMENT_MAX}
          </span>
        </div>
        {errors.comment && <div className="ff-error">{errors.comment}</div>}
      </div>

      <div className="ff-actions">
        <button type="submit" className="ff-btn primary" disabled={submitting}>
          {submitting ? "Sending..." : "Submit"}
        </button>
        <button
          type="button"
          className="ff-btn"
          onClick={resetForm}
          disabled={submitting}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
