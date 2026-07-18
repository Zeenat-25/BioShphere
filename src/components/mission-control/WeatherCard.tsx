import type { WeatherSnapshot } from "@/lib/biosphere/types";

const CONDITION_LABEL: Record<WeatherSnapshot["condition"], string> = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rain: "Rain",
  storm: "Storm",
  clear: "Clear",
};

export function WeatherCard({ weather }: { weather: WeatherSnapshot }) {
  return (
    <div className="card p-5 lg:col-span-2">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-muted">Live Weather</div>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full border ${
            weather.applicationWindow.open ? "border-ok/40 text-ok bg-ok/10" : "border-warn/40 text-warn bg-warn/10"
          }`}
        >
          {weather.applicationWindow.open ? "Application window open" : "Application window closed"}
        </span>
      </div>

      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-foreground">{weather.temperatureC}°C</span>
        <span className="text-sm text-muted">{CONDITION_LABEL[weather.condition]}</span>
        <span className="text-sm text-muted ml-auto">Humidity {weather.humidityPct}%</span>
        <span className="text-sm text-muted">Wind {weather.windKph} km/h</span>
      </div>

      <p className="mt-2 text-xs text-muted">{weather.applicationWindow.reason}</p>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {weather.forecast.map((d) => (
          <div key={d.date} className="text-center rounded-lg border border-border py-2">
            <div className="text-[10px] text-muted">
              {new Date(d.date).toLocaleDateString(undefined, { weekday: "short" })}
            </div>
            <div className="text-[11px] mt-1 text-foreground font-medium">
              {d.high}°/{d.low}°
            </div>
            <div className="text-[10px] text-accent-2 mt-0.5">{d.rainProbabilityPct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
