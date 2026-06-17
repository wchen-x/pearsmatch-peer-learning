import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 py-12 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
            Peer learning made easier
          </p>

          <h1 className="mt-3 text-5xl font-bold tracking-tight text-gray-900">
            Find your learning pear 🍐
          </h1>

          <p className="mt-5 text-lg text-gray-600">
            PearsMatch helps students connect with peers who can teach what they
            want to learn, while sharing the skills they already know.
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              to="/register"
              className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white"
            >
              Get started
            </Link>

            <Link
              to="/login"
              className="rounded-lg border px-5 py-3 font-medium"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="rounded-2xl bg-green-50 p-5">
            <p className="text-sm font-medium text-green-700">Example match</p>

            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="font-semibold">Bob can help with SQL</h2>
              <p className="mt-1 text-sm text-gray-600">
                You want to learn SQL, and Bob can teach it.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  SQL
                </span>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                  Peer match
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Teach what you know</h2>
          <p className="mt-2 text-sm text-gray-600">
            Add skills you can help others with, from coding to languages to
            hobbies.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Learn from peers</h2>
          <p className="mt-2 text-sm text-gray-600">
            List what you want to learn and find students who can support you.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Match by skills</h2>
          <p className="mt-2 text-sm text-gray-600">
            Get matched based on teach and learn skills, then send a connection
            request.
          </p>
        </div>
      </section>
    </div>
  );
}