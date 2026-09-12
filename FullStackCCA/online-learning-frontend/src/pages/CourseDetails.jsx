import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../components/context/AuthContext";

export default function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data));
    api.get(`/courses/${id}/reviews`).then((res) => setReviews(res.data));

    if (user?.role === "student") {
      api.get("/student/enrollments").then((res) => {
        const isEnrolled = res.data.some((e) => e.course_id === Number(id));
        setEnrolled(isEnrolled);
      });
    }
  }, [id, user]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setMessage("");
    try {
      if (course.price == 0) {
        await api.post(`/courses/${id}/enroll`);
      } else {
        await api.post(`/courses/${id}/checkout`);
      }
      setEnrolled(true);
      setMessage("Enrolled successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (!course) {
    return (
      <div
        className="max-w-4xl mx-auto px-6 py-12"
        style={{ color: "var(--color-text-muted)" }}
      >
        Loading...
      </div>
    );
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : null;

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
      <Link
        to="/"
        className="text-sm font-medium mb-6 inline-block"
        style={{ color: "var(--color-text-muted)" }}
      >
        ← Back to courses
      </Link>

      <span
        className="inline-block text-xs font-display font-semibold px-3 py-1 rounded-full mb-4"
        style={{
          backgroundColor: "var(--color-surface)",
          color: "var(--color-primary)",
        }}
      >
        {course.category?.name}
      </span>

      <h1
        className="font-display text-4xl font-bold mb-3"
        style={{ color: "var(--color-text)" }}
      >
        {course.title}
      </h1>

      <div
        className="flex items-center gap-4 mb-8 text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        <span>By {course.instructor?.name}</span>
        {avgRating && (
          <span>
            ★ {avgRating} ({reviews.length} reviews)
          </span>
        )}
      </div>

      <div
        className="rounded-2xl border p-6 mb-8"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <p
          className="mb-6 leading-relaxed"
          style={{ color: "var(--color-text)" }}
        >
          {course.description}
        </p>

        <div className="flex items-center justify-between">
          <span
            className="font-display text-2xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {course.price == 0 ? "Free" : `$${course.price}`}
          </span>

          {user?.role === "student" && !enrolled && (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="px-6 py-2.5 rounded-full font-display font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {enrolling
                ? "Enrolling..."
                : course.price == 0
                  ? "Enroll for free"
                  : "Buy course"}
            </button>
          )}

          {enrolled && (
            <Link
              to="/my-courses"
              className="px-6 py-2.5 rounded-full font-display font-semibold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Go to course →
            </Link>
          )}

          {!user && (
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-full font-display font-semibold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Log in to enroll
            </Link>
          )}
        </div>

        {message && (
          <p
            className="mt-4 text-sm font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            {message}
          </p>
        )}
      </div>

      <h2
        className="font-display text-2xl font-bold mb-4"
        style={{ color: "var(--color-text)" }}
      >
        Lessons
      </h2>
      <div className="space-y-2 mb-10">
        {course.lessons?.length === 0 && (
          <p style={{ color: "var(--color-text-muted)" }}>
            No lessons added yet.
          </p>
        )}
        {course.lessons?.map((lesson, i) => (
          <div
            key={lesson.id}
            className="flex items-center gap-4 rounded-xl border px-4 py-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span
              className="font-display font-semibold text-sm w-6"
              style={{ color: "var(--color-text-muted)" }}
            >
              {i + 1}
            </span>
            <span style={{ color: "var(--color-text)" }}>{lesson.title}</span>
          </div>
        ))}
      </div>

      <h2
        className="font-display text-2xl font-bold mb-4"
        style={{ color: "var(--color-text)" }}
      >
        Reviews
      </h2>
      <div className="space-y-4">
        {reviews.length === 0 && (
          <p style={{ color: "var(--color-text-muted)" }}>No reviews yet.</p>
        )}
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className="font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                {r.student?.name}
              </span>
              <span style={{ color: "var(--color-primary)" }}>
                {"★".repeat(r.rating)}
              </span>
            </div>
            <p style={{ color: "var(--color-text-muted)" }}>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
