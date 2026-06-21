export default function ArticleTimeline({ data }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
      <h3 className="font-inter font-bold text-foreground text-base mb-6">{data.title}</h3>
      <div className="relative">
        {/* Line */}
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-accent via-primary to-secondary hidden sm:block" />

        <div className="space-y-4">
          {data.data.map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              {/* Step circle */}
              <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-accent font-mono font-bold text-sm shrink-0 shadow-md">
                {item.step}
              </div>
              {/* Content */}
              <div className="flex-1 bg-secondary/50 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-inter font-bold text-sm text-foreground">{item.label}</div>
                </div>
                <span className="font-mono text-xs text-accent font-semibold bg-accent/10 px-2.5 py-1 rounded-full shrink-0">
                  {item.days}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="font-inter text-sm text-foreground">
          <span className="font-bold">Итого от заявки до выезда:</span> 14–21 рабочий день
        </div>
        <div className="font-inter text-sm font-bold text-accent">
          Подъёмные 2 500 000 ₽ через 5 дней после подписания
        </div>
      </div>
    </div>
  );
}