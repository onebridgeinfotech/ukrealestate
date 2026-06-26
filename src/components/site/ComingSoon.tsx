import { Link } from "@tanstack/react-router";
import { Hammer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center md:px-6">
      <span className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gold-gradient text-white shadow-gold">
        <Hammer className="h-7 w-7" />
      </span>
      <span className="mb-3 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">In progress</span>
      <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{description}</p>
      <Button asChild className="mt-8 h-12 bg-primary px-6 text-base text-primary-foreground hover:bg-primary/90">
        <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to home</Link>
      </Button>
    </section>
  );
}
