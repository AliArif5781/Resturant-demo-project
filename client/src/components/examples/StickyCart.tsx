import StickyCart from "../StickyCart";

export default function StickyCartExample() {
  return (
    <div className="space-y-4">
      <div className="h-40 flex items-center justify-center bg-muted rounded">
        <p className="text-muted-foreground">Cart Mode (scroll to see sticky bar)</p>
      </div>
      <StickyCart
        mode="cart"
        cartData={{ itemCount: 2, total: "$31.98" }}
        onOpenCart={() => console.log("Open cart")}
      />
    </div>
  );
}
