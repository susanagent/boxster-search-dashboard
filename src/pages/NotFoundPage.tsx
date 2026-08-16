import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div>
      <h1>Page not found</h1>
      <p>
        <Link to="/">Return to the dashboard</Link>
      </p>
    </div>
  );
}
