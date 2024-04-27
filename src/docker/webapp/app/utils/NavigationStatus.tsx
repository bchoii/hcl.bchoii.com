import { useNavigation } from "@remix-run/react";

export function NavigationStatus() {
  const navigation = useNavigation();
  return navigation.state != "idle" ? (
    <div style={{ position: "absolute", top: 0, right: 0 }}>
      {navigation.state}
    </div>
  ) : (
    <></>
  );
  // return (
  //   <div style={{ position: "absolute", top: 0, right: 0 }}>
  //     {navigation.state}
  //   </div>
  // );
  // if (navigation.state == "idle") {
  //   return <></>;
  // }
  // return <div style={{ position: "absolute", top: 0, right: 0 }}>Loading</div>;
}
