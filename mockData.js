// Used automatically when VITE_AIS_API_KEY is not set
// Mirrors the shape of real AIS API responses so swapping is seamless

export const PORTS = {
  shanghai:    { coords: [121.47, 31.23],  label: 'Shanghai' },
  singapore:   { coords: [103.82, 1.35],   label: 'Singapore' },
  rotterdam:   { coords: [4.47,   51.92],  label: 'Rotterdam' },
  losangeles:  { coords: [-118.24,33.73],  label: 'Los Angeles' },
  newyork:     { coords: [-74.0,  40.71],  label: 'New York' },
  dubai:       { coords: [55.27,  25.2],   label: 'Dubai' },
  sydney:      { coords: [151.2, -33.87],  label: 'Sydney' },
  hamburg:     { coords: [9.99,   53.55],  label: 'Hamburg' },
  mumbai:      { coords: [72.87,  18.97],  label: 'Mumbai' },
  busan:       { coords: [129.04, 35.1],   label: 'Busan' },
  capetown:    { coords: [18.42, -33.92],  label: 'Cape Town' },
  santos:      { coords: [-46.33,-23.95],  label: 'Santos' },
}

export const MOCK_SHIPS = [
  { id:'S01', name:'MV Pacific Eagle',   from:'shanghai',   to:'losangeles', progress:0.62, status:'transit', cargo:'Electronics',    tons:18400, eta:'2d 14h', speed:'14.2 kn' },
  { id:'S02', name:'MV Atlantic Star',   from:'rotterdam',  to:'newyork',    progress:0.38, status:'transit', cargo:'Auto parts',     tons:12200, eta:'4d 2h',  speed:'13.8 kn' },
  { id:'S03', name:'MV Silk Road',       from:'dubai',      to:'shanghai',   progress:0.81, status:'transit', cargo:'Crude oil',      tons:45000, eta:'18h',    speed:'15.1 kn' },
  { id:'S04', name:'MV Southern Cross',  from:'sydney',     to:'singapore',  progress:1.00, status:'arrived', cargo:'Iron ore',       tons:32000, eta:'Arrived',speed:'0 kn' },
  { id:'S05', name:'MV Hamburg Express', from:'hamburg',    to:'shanghai',   progress:0.45, status:'delayed', cargo:'Machinery',      tons:9800,  eta:'7d 6h',  speed:'10.2 kn' },
  { id:'S06', name:'MV Mumbai Star',     from:'mumbai',     to:'rotterdam',  progress:0.22, status:'transit', cargo:'Textiles',       tons:7600,  eta:'9d 12h', speed:'13.5 kn' },
  { id:'S07', name:'MV Pacific Trader',  from:'busan',      to:'losangeles', progress:0.55, status:'transit', cargo:'Consumer goods', tons:21000, eta:'3d 8h',  speed:'14.0 kn' },
  { id:'S08', name:'MV Cape Runner',     from:'capetown',   to:'rotterdam',  progress:0.10, status:'loading', cargo:'Minerals',       tons:15000, eta:'14d',    speed:'0 kn' },
  { id:'S09', name:'MV Amazon Queen',    from:'santos',     to:'rotterdam',  progress:0.33, status:'transit', cargo:'Soybeans',       tons:28000, eta:'6d 20h', speed:'13.2 kn' },
  { id:'S10', name:'MV Gulf Star',       from:'dubai',      to:'mumbai',     progress:0.72, status:'transit', cargo:'Chemicals',      tons:8500,  eta:'1d 4h',  speed:'14.5 kn' },
  { id:'S11', name:'MV Pacific Dawn',    from:'singapore',  to:'sydney',     progress:0.60, status:'delayed', cargo:'Food products',  tons:6200,  eta:'3d 16h', speed:'11.0 kn' },
  { id:'S12', name:'MV Nordic Frost',    from:'hamburg',    to:'newyork',    progress:0.90, status:'transit', cargo:'Pharma',         tons:4100,  eta:'12h',    speed:'14.8 kn' },
]
