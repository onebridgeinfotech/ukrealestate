import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, MessageSquare, Users, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

const DEPARTMENTS = [
  { icon: MessageSquare, title: "General Enquiries", email: "hello@marketuk.co.uk", desc: "Any questions about using MarketUK" },
  { icon: Users, title: "Seller Support", email: "sellers@marketuk.co.uk", desc: "Help posting and managing your listing" },
  { icon: Newspaper, title: "Press & Media", email: "press@marketuk.co.uk", desc: "Media requests and press materials" },
];

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-14 text-center text-white">
        <h1 className="font-display text-4xl font-extrabold">Contact Us</h1>
        <p className="mt-3 text-white/80">Our team is here to help — Mon–Fri 9am–6pm, Sat 10am–4pm</p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="mb-6 font-display text-2xl font-bold text-primary">Send us a message</h2>
            {sent ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-8 text-center">
                <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-emerald-100">
                  <MessageSquare className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-emerald-800">Message Sent!</h3>
                <p className="mt-1 text-sm text-emerald-700">We'll get back to you within one business day.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSent(false); setForm({ name:"",email:"",phone:"",subject:"",message:"" }); }}>Send Another</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Full name</Label><Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div><Label>Email</Label><Input className="mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                </div>
                <div><Label>Phone (optional)</Label><Input className="mt-1" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div>
                  <Label>Subject</Label>
                  <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Enquiry</SelectItem>
                      <SelectItem value="buyer">Buyer Support</SelectItem>
                      <SelectItem value="seller">Seller Support</SelectItem>
                      <SelectItem value="agent">Agent Enquiry</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="press">Press & Media</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Message</Label><Textarea className="mt-1" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" /></div>
                <Button className="w-full bg-gold text-white hover:bg-gold/90" onClick={() => setSent(true)}>Send Message</Button>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-primary">Our Office</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">MarketUK Ltd</p>
                    <p className="text-muted-foreground">20 Fenchurch Street, London EC3M 3BY</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a href="tel:02035550142" className="hover:text-primary">0203 555 0142</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href="mailto:hello@marketuk.co.uk" className="hover:text-primary">hello@marketuk.co.uk</a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="text-muted-foreground">
                    <p>Mon–Fri: 9:00am – 6:00pm</p>
                    <p>Saturday: 10:00am – 4:00pm</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl bg-primary/10 border border-primary/20">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 h-8 w-8 text-primary/50" />
                <p className="text-sm font-medium text-primary">20 Fenchurch Street, London</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="mt-1 text-xs text-muted-foreground hover:text-primary underline">View on Google Maps →</a>
              </div>
            </div>

            {/* Departments */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Departments</h3>
              {DEPARTMENTS.map(({ icon: Icon, title, email, desc }) => (
                <div key={title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                    <a href={`mailto:${email}`} className="mt-1 text-xs text-primary hover:underline">{email}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
