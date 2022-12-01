import React, { useState } from "react";
import { observer } from "mobx-react";
import { Theme } from "@mui/material/styles";
import { createStyles, Tooltip } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { Tabs, Tab } from "@mui/material";
import { TabPanel } from "../common/TabPanel";
import { ContextListeners } from "./ContextListeners";
import { IntentListeners } from "./IntentListeners";
import { AppChannelListeners } from "./AppChannelListeners";
import { SystemLog } from "./SystemLog";
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) => {
	return {
		[`@global`]: {
			[`.MuiTab-wrapper`]: {
				flexDirection: "row !important"
			}
		},
		root: {
			flexGrow: 1,
		},
		paper: {
			marginTop: theme.spacing(2),
			padding: theme.spacing(2),
			[`&:first-child`]: {
				marginTop: 0,
			},
		},
		systemLog: {
			maxHeight: "1000px",
			overflowY: "scroll",
		},
		indicator: {
			backgroundColor: "#00bbe1",
		},
		tabs: {
			borderBottomColor: "#acb2c0",
			borderBottomStyle: "solid",
			borderBottomWidth: "1px",
			minHeight: "28px",
		},
		icon: {
			marginBottom: "3px !important",
			fontSize: "15px",
			marginRight: "3px"
		},
	}

});

const a11yProps = (index: any) => {
	return {
		id: `scrollable-auto-tab-${index}`,
		"aria-controls": `scrollable-auto-tabpanel-${index}`,
	};
};

export const Workbench = observer(() => {
	const { classes } = useStyles();
	const [tabValue, setTabValue] = useState<number>(0);

	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<div>
			<Tabs
				value={tabValue}
				onChange={handleTabChange}
				indicatorColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				classes={{
					indicator: classes.indicator,
				}}
				className={classes.tabs}
			>
				<Tab label="Listeners" {...a11yProps(0)} style={{display:'flex',alignItems:'center'}} icon={
					<Tooltip 
						title="Context received will be displayed here, but you will not receive your own messages back" 
						aria-label="Context received will be displayed here, but you will not receive your own messages back" >
						<InfoIcon className={classes.icon} />
					</Tooltip>}
				/>
				<Tab label="System Log" {...a11yProps(1)} />
			</Tabs>

			<TabPanel value={tabValue} index={0}>
				<ContextListeners />
				<IntentListeners />
				<AppChannelListeners />
			</TabPanel>

			<div className={classes.systemLog}>
				<TabPanel value={tabValue} index={1}>
					<SystemLog />
				</TabPanel>
			</div>
		</div>
	);
});
