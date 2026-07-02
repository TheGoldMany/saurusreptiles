import { getCurrentUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { PACKS } from "@/lib/packs";
import PackOpener from "@/components/PackOpener";

export default async function PacksPage() {
  const { dict } = await getDict();
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-3xl font-black text-emerald-950">
        {dict.packs.title}
      </h1>
      <p className="mt-2 max-w-2xl text-stone-500">{dict.packs.subtitle}</p>
      <div className="mt-8">
        <PackOpener
          packs={PACKS}
          balance={user?.coins ?? 0}
          isLoggedIn={!!user}
        />
      </div>
    </div>
  );
}
