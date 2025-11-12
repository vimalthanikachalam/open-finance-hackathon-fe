import appStore from "@/store";

type Props = {};

const AccountAccessConsent = (props: Props) => {
  const { accessToken, oauthConsentId } = appStore();
  const store = appStore((state) => state);
  console.log("Store State:", store);
  return <div>Service not available</div>;
};

export default AccountAccessConsent;
