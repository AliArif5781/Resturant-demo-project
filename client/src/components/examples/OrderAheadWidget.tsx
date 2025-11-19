import OrderAheadWidget from "../OrderAheadWidget";

export default function OrderAheadWidgetExample() {
  return (
    <div className="p-6">
      <OrderAheadWidget onPlanOrder={(time) => console.log("Plan order for:", time)} />
    </div>
  );
}
