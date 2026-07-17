import Link from "next/link";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { AuthDivider } from "@/components/auth-divider";
import { FullWidthDivider } from "@/components/full-width-divider";
import { AtSignIcon, LockIcon, UserIcon } from "lucide-react";

type AuthMode = "sign-in" | "sign-up";

const authContent: Record<
	AuthMode,
	{
		title: string;
		description: string;
		submitLabel: string;
		alternatePrompt: string;
		alternateHref: string;
		alternateLabel: string;
	}
> = {
	"sign-in": {
		title: "Welcome back",
		description: "Sign in to your account to continue.",
		submitLabel: "Sign in",
		alternatePrompt: "Don't have an account?",
		alternateHref: "/sign-up",
		alternateLabel: "Sign up",
	},
	"sign-up": {
		title: "Create an account",
		description: "Get started. It only takes a moment.",
		submitLabel: "Create account",
		alternatePrompt: "Already have an account?",
		alternateHref: "/sign-in",
		alternateLabel: "Sign in",
	},
};

type AuthPageProps = {
	mode: AuthMode;
};

export function AuthPage({ mode }: AuthPageProps) {
	const content = authContent[mode];

	return (
		<div className="relative w-full overflow-hidden px-4 md:h-screen">
			<div className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center border-x *:px-6">
				<div className="flex flex-col space-y-6">
					<Link aria-label="Home" href="/">
						<Logo className="h-4.5" />
					</Link>
					<div className="space-y-1">
						<h1 className="font-semibold text-xl tracking-wide">
							{content.title}
						</h1>
						<p className="text-base text-muted-foreground">
							{content.description}
						</p>
					</div>
				</div>

				<div className="relative my-6 flex size-full flex-col gap-4 py-8">
					<FullWidthDivider position="top" />

					<Button className="w-full" type="button" variant="outline">
						<GoogleIcon data-icon="inline-start" />
						Continue with Google
					</Button>
					<AuthDivider>OR CONTINUE WITH EMAIL</AuthDivider>
					<form className="space-y-2">
						{mode === "sign-up" && (
							<InputGroup>
								<InputGroupInput
									aria-label="Full name"
									autoComplete="name"
									name="name"
									placeholder="Jane Doe"
									required
									type="text"
								/>
								<InputGroupAddon align="inline-start">
									<UserIcon />
								</InputGroupAddon>
							</InputGroup>
						)}

						<InputGroup>
							<InputGroupInput
								aria-label="Email address"
								autoComplete="email"
								name="email"
								placeholder="your.email@example.com"
								required
								type="email"
							/>
							<InputGroupAddon align="inline-start">
								<AtSignIcon />
							</InputGroupAddon>
						</InputGroup>

						<InputGroup>
							<InputGroupInput
								aria-label="Password"
								autoComplete={
									mode === "sign-in" ? "current-password" : "new-password"
								}
								name="password"
								placeholder="Enter your password"
								required
								type="password"
							/>
							<InputGroupAddon align="inline-start">
								<LockIcon />
							</InputGroupAddon>
						</InputGroup>

						{mode === "sign-in" && (
							<div className="flex justify-end">
								<Link
									className="text-muted-foreground text-sm underline underline-offset-4 hover:text-primary"
									href="#"
								>
									Forgot password?
								</Link>
							</div>
						)}

						<Button className="w-full" size="sm" type="submit">
							{content.submitLabel}
						</Button>
					</form>
					<FullWidthDivider position="bottom" />
				</div>

				<p className="text-center text-muted-foreground text-sm">
					{content.alternatePrompt}{" "}
					<Link
						className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
						href={content.alternateHref}
					>
						{content.alternateLabel}
					</Link>
				</p>

				<p className="mt-6 text-center text-muted-foreground text-sm">
					This site is protected by reCAPTCHA and the Google{" "}
					<a
						className="underline underline-offset-4 hover:text-primary"
						href="#"
					>
						Privacy Policy
					</a>{" "}
					and{" "}
					<a
						className="underline underline-offset-4 hover:text-primary"
						href="#"
					>
						Terms of Service
					</a>{" "}
					apply.
				</p>
			</div>
		</div>
	);
}
