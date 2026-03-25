import { Calendar, MapPin, ArrowUpRight } from "lucide-react";

const tourDates = [
  { id: 1, date: "OCT 14", venue: "Printworks", location: "London, UK", status: "SOLD OUT" },
  { id: 2, date: "OCT 21", venue: "Awakenings", location: "Amsterdam, NL", status: "TICKETS" },
  { id: 3, date: "NOV 04", venue: "Space", location: "Miami, FL", status: "TICKETS" },
  { id: 4, date: "NOV 11", venue: "Berghain", location: "Am Wriezener Bahnhof", status: "SOLD OUT" },
  { id: 5, date: "DEC 02", venue: "Tomorrowland", location: "Itu, Brazil", status: "RSVP" },
];

export function TourSection() {
  return (
    <section id="tour" className="w-full bg-zinc-950 py-24 px-6 md:px-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4 md:space-y-0">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">On Tour</h2>
          <button className="text-sm uppercase tracking-widest text-neutral-400 hover:text-white transition-colors pb-1 border-b border-transparent hover:border-white">
            View All Dates
          </button>
        </div>

        <div className="flex flex-col border-t border-zinc-800">
          {tourDates.map((gig) => (
            <div 
              key={gig.id} 
              className="group flex flex-col md:flex-row justify-between items-start md:items-center py-8 border-b border-zinc-800 hover:bg-zinc-900 transition-colors px-4 -mx-4 cursor-pointer"
            >
              {/* Date & Location Group */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 w-full md:w-2/3">
                <div className="flex items-center gap-4 min-w-[120px]">
                  <Calendar size={20} className="text-neutral-500 group-hover:text-white transition-colors" />
                  <span className="text-xl md:text-2xl font-bold tracking-tight text-neutral-300 group-hover:text-white transition-colors">
                    {gig.date}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold uppercase tracking-tight group-hover:text-white transition-colors">
                    {gig.venue}
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-neutral-500">
                    <MapPin size={14} />
                    <span className="text-sm uppercase tracking-widest">{gig.location}</span>
                  </div>
                </div>
              </div>

              {/* Status/CTA Action */}
              <div className="mt-6 md:mt-0 w-full md:w-auto flex justify-start md:justify-end">
                <button 
                  className={`flex items-center gap-2 px-6 py-3 border text-sm uppercase tracking-widest transition-all ${
                    gig.status === "SOLD OUT" 
                      ? "border-neutral-800 text-neutral-600 cursor-not-allowed"
                      : "border-white/30 text-white hover:bg-white hover:text-black group-hover:border-white"
                  }`}
                  disabled={gig.status === "SOLD OUT"}
                >
                  {gig.status}
                  {gig.status !== "SOLD OUT" && <ArrowUpRight size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}