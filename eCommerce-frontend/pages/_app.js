import '@/styles/globals.css';
import Layout from "@/components/Layout";
import { ThemeProvider } from "next-themes";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {TokenProvider} from "@/contexts/JWTContext";
import {RefreshProvider} from "@/contexts/RefreshContext";
import {UserProvider} from "@/contexts/UserContext";
import {SessionProvider} from "next-auth/react";
import {appWithTranslation} from "next-i18next";

function App({ Component, pageProps, session }) {

  return (
    <>
        <SessionProvider session={session}>
            <UserProvider>
                <RefreshProvider>
                    <TokenProvider>
                        <ThemeProvider attribute="class" defaultTheme="light">
                            <Layout>
                                <Component {...pageProps} />
                                <ToastContainer/>
                            </Layout>
                        </ThemeProvider>
                    </TokenProvider>
                </RefreshProvider>
            </UserProvider>
        </SessionProvider>
    </>
  )
  
}

export default appWithTranslation(App)
