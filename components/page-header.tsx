import { Reveal } from "@/components/reveal";

export function PageHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <Reveal className="mb-10 flex flex-col gap-3">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="text-[40px] leading-[1.15] sm:text-[48px]">{title}</h1>
    </Reveal>
  );
}
