import React, { useEffect, useState, useMemo } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import Loading from '../components/common/Loading';

export const LocaleIntlProvider = ({
  locale = 'en',
  children,
  loadingComponent
}: {
  locale?: string;
  children?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}): JSX.Element => {
  const [messages, setMessages] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    import(`../locales/${locale}`)
      .then((localeMessages: { [key: string]: Record<string, string> }) => {
        const messagesKey = Object.keys(localeMessages)[0];
        setMessages(localeMessages[messagesKey]);
      })
      .catch(async (e) => {
        console.log(`Could not find locale ${locale}, reverting to English`, e);
        const enMessages = await import('../locales/en');
        setMessages(enMessages.en);
      });
  }, [locale]);

  if (!messages) {
    return loadingComponent ? <>{loadingComponent}</> : <Loading />;
  }

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export const useMessage = (
  id: string,
  values?: { [key: string]: any }
): string | undefined => {
  const intl = useIntl();
  return intl.formatMessage({ id }, values);
};

export const useMessages = (
  ids: string[],
  values?: { [key: string]: any }
): Record<string, string> => {
  const intl = useIntl();
  return useMemo(
    () =>
      ids.reduce(
        (obj, id) =>
          Object.assign(obj, { [id]: intl.formatMessage({ id }, values) }),
        {}
      ),
    [ids, intl, values]
  );
};