const items = ["Agents", "People", "Systems", "Automations", "Governance", "Outcomes"];

const Ticker = () => {
  const doubled = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
