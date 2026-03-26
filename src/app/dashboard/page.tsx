import ScoreEntry from "@/components/dashboard/ScoreEntry";
import CharitySelector from "@/components/dashboard/CharitySelector";
import WinningsOverview from "@/components/dashboard/WinningsOverview";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/dashboard/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,full_name")
    .eq("auth_user_id", user!.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, plan, current_period_end")
    .eq("user_id", profile?.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900">Golf Charity Platform</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{profile?.full_name}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">
            Subscription Status
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {subscription?.status === "active" ? "Active" : "Inactive"}
              </p>

              {subscription?.current_period_end && (
                <p className="text-sm text-gray-500">
                  Renewal:{" "}
                  {new Date(
                    subscription.current_period_end,
                  ).toLocaleDateString()}
                </p>
              )}
            </div>

            <span
              className={`px-3 py-1 text-xs rounded-full ${
                subscription?.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {subscription?.status}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <ScoreEntry />
          </div>
          <CharitySelector />
          <WinningsOverview />
        </div>
      </main>
    </div>
  );
}
