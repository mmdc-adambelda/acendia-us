import Script from "next/script";

/**
 * GoHighLevel / LeadConnector live chat widget. Loads only if
 * NEXT_PUBLIC_GHL_CHAT_WIDGET_ID is set — same "no placeholder IDs"
 * convention as components/Analytics.tsx, so this stays inert until a
 * real widget ID is configured in the deployment environment.
 *
 * strategy="lazyOnload": a chat bubble isn't part of the critical
 * first-paint experience, so it loads during idle time rather than
 * competing with page content for bandwidth/main-thread time.
 */
export default function ChatWidget() {
  const widgetId = process.env.NEXT_PUBLIC_GHL_CHAT_WIDGET_ID;
  if (!widgetId) return null;

  return (
    <Script
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id={widgetId}
      strategy="lazyOnload"
    />
  );
}
