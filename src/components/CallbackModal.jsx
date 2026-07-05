import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle } from "lucide-react";
const GATEKEEPER_API_KEY = "sk_web_form_a67191e0bb38eb17653f58eeb34e2bfceaa7f2b372ded560598cb37f27477862636de465e3d3494c1799185619b30cef";
import { toast } from "@/components/ui/use-toast";

export default function CallbackModal({ open, onClose }) {
  const [form, setForm] = useState({ full_name: "", phone: "", consent: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent || !form.phone) return;
    setLoading(true);
    try {
      const externalId = `callback_${Date.now()}`;
      await fetch('https://bratouverie-snb.base44.app/api/gatekeeper/inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': GATEKEEPER_API_KEY },
        body: JSON.stringify({
          source: 'callback_form',
          externalId,
          payload: { type: 'callback', full_name: form.full_name, phone: form.phone, consent: form.consent },
        }),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setForm({ full_name: "", phone: "", consent: false });
        onClose();
      }, 2500);
    } catch (err) {
      toast({
        title: "Не удалось отправить заявку",
        description: "Проверьте интернет-соединение и попробуйте снова",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        {success ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <CheckCircle className="h-14 w-14 text-green-500" />
            <h3 className="font-inter font-bold text-lg text-foreground">Мы перезвоним!</h3>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-inter font-bold text-xl">Обратный звонок</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label className="font-inter">Ваше имя</Label>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Иван"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-inter">Телефон *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+7 (999) 123-45-67"
                  className="mt-1"
                  required
                />
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={form.consent}
                  onCheckedChange={(c) => setForm({ ...form, consent: !!c })}
                  id="consent-cb"
                />
                <Label htmlFor="consent-cb" className="text-sm text-muted-foreground font-inter leading-snug cursor-pointer">
                  Согласен на{" "}
                  <a href="/consent" target="_blank" className="text-accent underline hover:no-underline">
                    обработку персональных данных
                  </a>
                </Label>
              </div>
              <Button
                type="submit"
                disabled={loading || !form.consent || !form.phone}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold py-5"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Перезвоните мне"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}