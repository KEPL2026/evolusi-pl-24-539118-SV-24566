import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";

export default function Dashboard() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const fetchTasks = async () => {
        try {
            const res = await axios.get("/api/tasks");
            setTasks(res.data);
        } catch {
            setError("Gagal memuat daftar tugas.");
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setSubmitting(true);
        setError("");
        try {
            const res = await axios.post("/api/tasks", {
                title: title.trim(),
                description: description.trim() || null,
                is_completed: false,
            });
            setTasks([res.data, ...tasks]);
            setTitle("");
            setDescription("");
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menambahkan tugas.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleTask = async (task) => {
        try {
            const updatedStatus = !task.is_completed;
            const res = await axios.put(`/api/tasks/${task.id}`, {
                is_completed: updatedStatus,
            });
            setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
        } catch {
            setError("Gagal memperbarui status tugas.");
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`/api/tasks/${id}`);
            setTasks(tasks.filter((t) => t.id !== id));
        } catch {
            setError("Gagal menghapus tugas.");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
        } catch {
            // proceed regardless
        }
        setUser(null);
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Top Navbar */}
            <nav className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow">
                            ✓
                        </div>
                        <div>
                            <span className="text-lg font-bold text-gray-900">TaskFlow</span>
                            <span className="ms-2 rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                                To-Do List
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-end text-xs sm:text-sm">
                            <p className="font-semibold text-gray-800">{user?.name || "Pengguna"}</p>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 hover:text-red-600"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                {/* Add Task Card */}
                <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900">Tambah Tugas Baru</h2>
                    <p className="text-sm text-gray-500">Kelola rencana dan aktivitas harian Anda.</p>

                    {error && (
                        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAddTask} className="mt-4 space-y-3">
                        <div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Judul tugas (contoh: Menyelesaikan modul 03 KEPL)..."
                                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Deskripsi singkat atau catatan tambahan (opsional)..."
                                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>
                        <div className="flex justify-end pt-1">
                            <button
                                type="submit"
                                disabled={submitting || !title.trim()}
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {submitting ? "Menyimpan..." : "+ Tambah ke Daftar"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tasks Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">
                        Daftar Tugas ({tasks.length})
                    </h3>
                    <div className="text-xs text-gray-500">
                        {tasks.filter((t) => t.is_completed).length} selesai dari {tasks.length} tugas
                    </div>
                </div>

                {/* Tasks List - Long Horizontal Cards (Card Panjang) */}
                {loadingTasks ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                        Memuat data tugas...
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-400">
                            📝
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800">Belum ada tugas</h4>
                        <p className="mt-1 text-xs text-gray-500">
                            Tulis tugas pertama Anda pada form di atas.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border p-4 shadow-sm transition ${
                                    task.is_completed
                                        ? "border-emerald-200 bg-emerald-50/40"
                                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow"
                                }`}
                            >
                                {/* Left Side: Checkbox & Text Info */}
                                <div className="flex items-start gap-3.5 flex-1">
                                    <input
                                        type="checkbox"
                                        checked={task.is_completed}
                                        onChange={() => handleToggleTask(task)}
                                        className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                    <div className="flex-1">
                                        <h4
                                            className={`text-sm font-semibold leading-snug ${
                                                task.is_completed
                                                    ? "text-gray-400 line-through"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            {task.title}
                                        </h4>
                                        {task.description && (
                                            <p
                                                className={`mt-1 text-xs ${
                                                    task.is_completed
                                                        ? "text-gray-400"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {task.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Badge & Delete Button */}
                                <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            task.is_completed
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-amber-100 text-amber-800"
                                        }`}
                                    >
                                        {task.is_completed ? "Selesai" : "Belum Selesai"}
                                    </span>

                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                        title="Hapus tugas"
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
