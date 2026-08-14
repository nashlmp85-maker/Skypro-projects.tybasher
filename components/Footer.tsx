'use client'

export default function Footer() {
  return (
    <footer className="bg-[#0A2540] text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Skypro Projects</h4>
          <p className="text-sm">Engineering & Water Solutions across Zimbabwe</p>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Services</h5>
          <ul className="text-sm space-y-1">
            <li>Borehole Drilling</li>
            <li>Solar Pumping</li>
            <li>Irrigation</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Contact</h5>
          <p className="text-sm">0777 984 454</p>
          <p className="text-sm">162 Showgrounds Harare Zimbabwe</p>
        </div>
        <div>
          <h5 className="font-semibold mb-2">Business Hours</h5>
          <p className="text-sm">Mon - Sat: 8:00 - 17:00</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm flex justify-between">
          <div>© {new Date().getFullYear()} Skypro Projects Water Solutions</div>
          <div>Subscribe: <input aria-label="newsletter" placeholder="Your email" className="ml-2 p-1 rounded text-black" /></div>
        </div>
      </div>
    </footer>
  )
}
