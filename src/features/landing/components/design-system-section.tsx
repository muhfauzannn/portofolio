"use client";

import { ArrowRight, Boxes, Code2, MousePointer2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/features/landing/components/eyebrow";

const PALETTE = [
  {
    n: "Off-White",
    hex: "#F7F7F7",
    cls: "bg-brand-cream",
    fg: "text-brand-charcoal",
    ring: true,
  },
  {
    n: "Charcoal",
    hex: "#1A1A1A",
    cls: "bg-brand-charcoal",
    fg: "text-brand-cream",
  },
  {
    n: "Electric Lime",
    hex: "#84FF44",
    cls: "bg-brand-lime",
    fg: "text-brand-lime-foreground",
  },
  {
    n: "Indigo",
    hex: "#6544FF",
    cls: "bg-brand-purple",
    fg: "text-brand-purple-foreground",
  },
];

const RADII = [
  { n: "Crisp", d: "6–8px · content cards", r: "rounded-lg" },
  { n: "Medium", d: "14px · feature blocks", r: "rounded-2xl" },
  { n: "Pill", d: "9999px · nav & badges", r: "rounded-full" },
];

export function DesignSystemSection() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow>
            <span className="mx-auto">Under the hood</span>
          </Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-bold sm:text-5xl">
            The design system
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Every surface on this page is built from these tokens and shadcn
            primitives — customized to the toolkit&apos;s brutalist-polished
            language.
          </p>
        </Reveal>

        {/* Palette */}
        <Reveal className="mt-14">
          <h3 className="mb-4 font-heading text-lg font-semibold">Palette</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PALETTE.map((c) => (
              <div
                key={c.n}
                className={`flex aspect-[4/3] flex-col justify-end rounded-lg p-4 ${c.cls} ${c.fg} ${c.ring ? "ring-1 ring-border" : ""}`}
              >
                <div className="font-heading font-semibold">{c.n}</div>
                <div className="font-mono text-xs opacity-70">{c.hex}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Radius hierarchy */}
        <Reveal className="mt-12">
          <h3 className="mb-4 font-heading text-lg font-semibold">
            Border-radius hierarchy
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {RADII.map((t) => (
              <div
                key={t.n}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div
                  className={`grid size-16 shrink-0 place-items-center bg-brand-purple/15 text-brand-purple ${t.r}`}
                >
                  <Boxes className="size-6" />
                </div>
                <div>
                  <div className="font-heading font-medium">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.d}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Typography */}
        <Reveal className="mt-12">
          <h3 className="mb-4 font-heading text-lg font-semibold">Typography</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-xs tracking-wide text-muted-foreground uppercase">
                Display / UI — Space Grotesk
              </div>
              <div className="mt-2 font-heading text-4xl font-bold tracking-tight">
                Ship bolder ideas
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Clean, structured, highly legible. Heavy weights for headlines,
                regular for body.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-xs tracking-wide text-muted-foreground uppercase">
                Accent — Caveat
              </div>
              <div className="mt-2 font-script text-5xl text-brand-purple">
                See what it can do!
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Handwritten highlights that break the rigid grid.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Component gallery */}
        <Reveal className="mt-12">
          <h3 className="mb-4 font-heading text-lg font-semibold">Components</h3>
          <Tabs defaultValue="actions" className="w-full">
            <TabsList>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="overlay">Overlay</TabsTrigger>
            </TabsList>

            <TabsContent value="actions">
              <Card>
                <CardHeader>
                  <CardTitle>Buttons &amp; badges</CardTitle>
                  <CardDescription>
                    Brand variants and pill sizes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button>Primary</Button>
                    <Button variant="purple">Purple</Button>
                    <Button variant="charcoal">Charcoal</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button size="pill">Pill</Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="lime">Lime</Badge>
                    <Badge variant="purple">Purple</Badge>
                    <Badge variant="charcoal">Charcoal</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                  <div>
                    <div className="mb-2 text-sm text-muted-foreground">
                      Toggle group
                    </div>
                    <ToggleGroup
                      type="single"
                      defaultValue="grid"
                      variant="outline"
                    >
                      <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
                      <ToggleGroupItem value="list">List</ToggleGroupItem>
                      <ToggleGroupItem value="flow">Flow</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forms">
              <Card>
                <CardHeader>
                  <CardTitle>Get early access</CardTitle>
                  <CardDescription>
                    Join the waitlist for the next drop.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input placeholder="you@studio.com" type="email" />
                    <Button
                      className="shrink-0"
                      onClick={() => toast.success("You're on the list ✦")}
                    >
                      Notify me <ArrowRight data-icon="inline-end" />
                    </Button>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Onboarding</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <Progress value={72} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                  <CardDescription>
                    Accordion, tooltip &amp; hover card.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="a">
                      <AccordionTrigger>What&apos;s included?</AccordionTrigger>
                      <AccordionContent>
                        Every component, motion preset and 3D asset, plus source
                        files and lifetime updates.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="b">
                      <AccordionTrigger>
                        Can I use it commercially?
                      </AccordionTrigger>
                      <AccordionContent>
                        Yes — a single license covers unlimited client and
                        personal projects.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="flex flex-wrap items-center gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Code2 />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy snippet</TooltipContent>
                    </Tooltip>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost">Hover a creator</Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>DS</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Dennis S.</div>
                          <div className="text-xs text-muted-foreground">
                            40+ interaction systems
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overlay">
              <Card>
                <CardHeader>
                  <CardTitle>Dialog</CardTitle>
                  <CardDescription>
                    Modal surfaces use crisp corners.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="purple">Open preview</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Momentum Based Hover</DialogTitle>
                        <DialogDescription>
                          A physics-driven hover interaction, drop-in ready.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid aspect-video place-items-center rounded-lg bg-muted">
                        <MousePointer2 className="size-10 text-brand-purple" />
                      </div>
                      <Button onClick={() => toast("Added to your vault")}>
                        Add to vault
                      </Button>
                    </DialogContent>
                  </Dialog>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Built with shadcn/ui · radix · Tailwind v4
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}
