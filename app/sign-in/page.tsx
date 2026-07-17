import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";

export const metadata: Metadata = {
	title: "Sign in",
	description: "Sign in to your Geo Pulse account.",
};

export default function SignInPage() {
	return <AuthPage mode="sign-in" />;
}
