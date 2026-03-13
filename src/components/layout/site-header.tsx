import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";

const navigation = [
  { label: "Услуги", href: "/services/seo-prodvizhenie" },
  { label: "Кейсы", href: "#cases" },
  { label: "Акции", href: "#" },
  { label: "Отзывы", href: "#home-testimonials" },
  { label: "Контакты", href: "#lead" },
];

export function SiteHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-40 border-b border-white/5 bg-white/5 backdrop-blur-md">
      <Container className="flex min-h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-3.svg"
              alt="Hastra"
              width={160}
              height={44}
              priority
              className="h-9 w-auto"
            />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-white lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[var(--color-accent)]">
              {item.label}
            </Link>
          ))}
          </nav>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <span className="text-sm text-white/90">8 (800) 333-13-49</span>
          <ButtonLink href="#lead" intent="primary" className="rounded-full">
            Отправить заявку
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
