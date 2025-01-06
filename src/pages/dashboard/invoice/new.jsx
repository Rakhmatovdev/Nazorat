import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { InvoiceCreateView } from 'src/sections/invoice/view';

// ----------------------------------------------------------------------

const metadata = { title: `Yangi yaratish | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <InvoiceCreateView />
    </>
  );
}
