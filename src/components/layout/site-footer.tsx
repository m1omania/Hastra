import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";

const serviceLinks = [
  { label: "SEO-продвижение", href: "/services/seo-prodvizhenie" },
  { label: "Контекстная реклама", href: "/services/context-ads" },
  { label: "Управление репутацией", href: "#" },
  { label: "Таргетированная реклама", href: "#" },
  { label: "Комплексное продвижение сайта", href: "#" },
  { label: "Тематики", href: "#" },
  { label: "Все услуги", href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate py-14">
      <div
        className="absolute inset-0 z-10 border-t border-white/10 bg-[var(--color-primary)]"
        aria-hidden
      />
      <Container className="relative z-20 space-y-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr_0.9fr]">
          <div className="space-y-5">
            <Image src="/logo-3.svg" alt="Hastra" width={160} height={44} className="h-10 w-auto" />
            <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
              Отправляя любую заявку на сайте `hastra.ru`, вы даете согласие на
              обработку персональных данных и подтверждаете ознакомление с
              политикой обработки персональных данных.
            </p>
            <p className="text-xs leading-6 text-[var(--color-muted)]">
              На сайте используется сервис Яндекс SmartCaptcha в целях обеспечения
              безопасности, защиты от автоматизированных запросов и
              предотвращения злоупотреблений.
            </p>
            <p className="text-sm text-[var(--color-muted)]">Защита персональных данных</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Услуги
            </h4>
            <div className="mt-5 grid gap-3 text-sm text-[var(--color-muted)]">
              {serviceLinks.map((item) => (
                <Link key={item.href + item.label} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
              <Link href="#cases" className="transition hover:text-white">
                Кейсы
              </Link>
              <Link href="#" className="transition hover:text-white">
                Блог
              </Link>
              <Link href="#" className="transition hover:text-white">
                Сервисы
              </Link>
            </div>
          </div>

          <div className="space-y-3 text-sm text-[var(--color-muted)]">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Контакты
            </h4>
            <p>info@hastra.ru</p>
            <p>8 (800) 333-13-49</p>
            <p>ПН-ПТ с 11:00 — 19:00 по МСК</p>
            <p>Москва Летниковская улица, 2</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-sm text-[var(--color-muted)]">
          © 2026 Digital-агентство Hastra
        </div>
      </Container>
    </footer>
  );
}
