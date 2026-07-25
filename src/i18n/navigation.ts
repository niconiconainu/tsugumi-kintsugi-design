import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

/** ロケール接頭辞を自動で付けるナビゲーション。画面側は next/link ではなくこれを使う。 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
