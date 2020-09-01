import React from "react";
import { HistoryProvider } from "./contexts/History.context";
import { UserProvider } from "./contexts/User.context";
import { BinManagerProvider } from "./contexts/BinManager.context";

export default ({ children }) => (
	<BinManagerProvider>
		<UserProvider>
			<HistoryProvider>{children}</HistoryProvider>
		</UserProvider>
	</BinManagerProvider>
);
