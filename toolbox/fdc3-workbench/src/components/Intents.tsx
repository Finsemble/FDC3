import React, { ChangeEvent, useEffect, useState } from "react";
import fdc3, { AppIntent, AppMetadata, ContextType, IntentResolution } from "../utility/Fdc3Api";
import { toJS } from "mobx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
	Button,
	IconButton,
	Tooltip,
	Typography,
	Grid,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Radio,
	TextField,
	Switch,
	Link,
	ListSubheader,
} from "@material-ui/core";
import { observer } from "mobx-react";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { ContextTemplates } from "../components/ContextTemplates";
import intentStore from "../store/IntentStore";
import { codeExamples } from "../fixtures/codeExamples";
import { openApiDocsLink } from "../fixtures/openApiDocs";
import { TemplateTextField } from "./common/TemplateTextField";
import { copyToClipboard } from "./common/CopyToClipboard";
import { IntentResolutionField } from "./IntentResolutionField";

import { Checkbox } from "@material-ui/core";
import { FormGroup } from "@material-ui/core";
import { FormControlLabel } from "@material-ui/core";
import { RadioGroup } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { AppIdentifier } from "fdc3-2.0";

// interface copied from lib @material-ui/lab/Autocomplete
interface FilterOptionsState<T> {
	inputValue: string;
	getOptionLabel: (option: T) => string;
}

interface ListenerOptionType {
	title: string;
	value: string;
}

type ListenerSetValue = (value: ListenerOptionType | null) => void;

type ListenerSetError = (error: string | false) => void;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		title: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
		},
		form: {
			display: "flex",
			flexWrap: "wrap",
			alignItems: "center",
			marginTop: theme.spacing(1),
			"& > *": {
				margin: theme.spacing(1),
				marginLeft: "0px",
			},
		},
		controls: {
			"& > *:first-child": {
				marginLeft: 0,
			},
			"& > *": {
				marginRight: theme.spacing(1),
			},
			"& > *:last-child": {
				marginRight: 0,
			},
			"& .MuiIconButton-sizeSmall": {
				padding: "6px 0px 6px 0px",
			},
			"& > a": {
				display: "flex",
				padding: "6px 0px 6px 0px",
			},
			display: "flex",
			alignItems: "center",
		},
		rightAlign: {
			flexDirection: "row",
			justifyContent: "flex-end",
		},
		spread: {
			flexDirection: "row",
			"& > *:first-child": {
				paddingLeft: "0px",
			},
		},
		textField: {
			width: "100%",
			"& input": {
				height: "29px",
				padding: "6px",
			},
		},
		h4: {
			fontSize: "22px",
		},
		field: {
			flexGrow: 1,
			marginRight: theme.spacing(1),
			minWidth: "190px",
		},
		border: {
			height: "1px",
			width: "100%",
			backgroundColor: "#acb2c0",
			marginTop: "24px",
			marginBottom: "16px",
		},
		bottomMargin: {
			marginBottom: theme.spacing(1),
		},
		removeSidePadding: {
			paddingLeft: 0,
		},
		targetSelect: {
			width: "100%",
			marginRight: theme.spacing(1),
		},
		rightPadding: {
			paddingRight: theme.spacing(0.5),
		},
		input: {
			color: "#0086bf",
			outline: "1px",
			"&.Mui-checked": {
				color: "#0086bf",
			},
		},
		toggle: {
			"&.Mui-selected": {
				color: "#0086bf",
				backgroundColor: "rgba(0, 134, 191, 0.21)",
			},
		},
		indentLeft: {
			marginLeft: "30px",
		},
		caption: {
			color: "#0086bf",
			marginTop: "10px",
		},
	})
);

const filter = createFilterOptions<ListenerOptionType>();

export const Intents = observer(({ handleTabChange }: { handleTabChange: any }) => {
	const classes = useStyles();
	const [intentValue, setIntentValue] = useState<ListenerOptionType | null>(null);
	const [raiseIntentError, setRaiseIntentError] = useState<string | false>(false);
	const [intentListener, setIntentListener] = useState<ListenerOptionType | null>(null);
	const [intentsForContext, setIntentsForContext] = useState<ListenerOptionType[] | null>(null);
	const [targetApp, setTargetApp] = useState<AppMetadata | null>(null);
	const [contextTargetApp, setContextTargetApp] = useState<any | null>(null);
	const [raiseIntentContext, setRaiseIntentContext] = useState<ContextType | null>(null);
	const [raiseIntentWithContextContext, setRaiseIntentWithContextContext] = useState<ContextType | null>(null);
	const [intentError, setIntentError] = useState<string | false>(false);
	const [intentResolution, setIntentResolution] = useState<IntentResolution | undefined | null>(null);
	const [intentForContextResolution, setIntentForContextResolution] = useState<IntentResolution | undefined | null>(
		null
	);
	const intentListenersOptions: ListenerOptionType[] = intentStore.intentsList;
	const [contextFields, setContextFields] = useState<any[]>([]);
	const [resultTypeContext, setResultTypeContext] = useState<ContextType | null>(null);
	const [resultOverChannelContextList, setResultOverChannelContextList] = useState<any>({});
	const [resultOverChannelContextDelays, setResultOverChannelContextDelays] = useState<any>({});
	const [sendIntentResult, setSendIntentResult] = useState<boolean | undefined>(false);
	const [resultType, setResultType] = useState<string | null>(null);
	const [useTargets, setUseTargets] = useState<boolean>(false);
	const [useContextTargets, setUseContextTargets] = useState<boolean>(false);
	const [channelType, setChannelType] = useState<string | null>("app-channel");
	const [sendResultOverChannel, setSendResultOverChannel] = useState<boolean | undefined>(false);
	const [currentAppChannelId, setCurrentAppChannelId] = useState<string>("");
	const [currContextIntents, setCurrContextIntents] = useState<AppIntent[]>([]);
	const [targetOptions, setTargetOptions] = useState<AppMetadata[]>([]);
	const [targetOptionsforContext, setTargetOptionsforContext] = useState<AppMetadata[]>([]);

	const handleRaiseIntent = async () => {
		setIntentResolution(null);
		if (!intentValue) {
			setRaiseIntentError("enter intent name");
		} else if (!raiseIntentContext) {
			setRaiseIntentError("enter context name");
		} else if (targetApp) {
			setIntentResolution(await intentStore.raiseIntent(intentValue.value, raiseIntentContext, targetApp));
			setRaiseIntentError("");
		} else {
			setIntentResolution(await intentStore.raiseIntent(intentValue.value, raiseIntentContext));
			setRaiseIntentError("");
		}
	};

	const handleRaiseIntentForContext = async () => {
		if (!raiseIntentWithContextContext) {
			return;
		}
		if (contextTargetApp) {
			setIntentForContextResolution(
				await intentStore.raiseIntentForContext(raiseIntentWithContextContext, contextTargetApp)
			);
		} else {
			setIntentForContextResolution(await intentStore.raiseIntentForContext(raiseIntentWithContextContext));
		}
	};

	const handleTargetChange = (event: React.ChangeEvent<{value: unknown}>) => {
		if (event.target.value === "None") {
			setTargetApp(null);
		} else {
			const targetObj = JSON.parse(event.target.value as string);
			let target = {
				appId: targetObj.appId || targetObj.name, 
				...(targetObj.instanceId && {instanceId: targetObj.instanceId || ""})
			};
			setTargetApp(target);
		}
	};

	const handleContextTargetChange = (event: React.ChangeEvent<{ value: unknown }>) => {
			if (event.target.value === "None") {
				setContextTargetApp(null);
			} else {
				const contextTargetObj = JSON.parse(event.target.value as string);
				const currentTargetApp = {
					appId: contextTargetObj.appId || contextTargetObj.name, 
					...(contextTargetObj.instanceId && {instanceId: contextTargetObj.instanceId || ""})
				};
				setContextTargetApp(currentTargetApp);
			}
	};

	const handleChangeListener =
		(setValue: ListenerSetValue, setError: ListenerSetError) => (event: React.ChangeEvent<{}>, newValue: any) => {
			if (typeof newValue === "string") {
				setValue({
					title: newValue,
					value: newValue,
				});
			} else if (newValue && newValue.inputValue) {
				setValue({
					title: newValue.inputValue,
					value: newValue.inputValue,
				});
			} else {
				setValue(newValue);
			}

			setError(false);
		};

	const getOptionLabel = (option: ListenerOptionType) => option.value || option.title;

	const filterOptions = (options: ListenerOptionType[], params: FilterOptionsState<ListenerOptionType>) => {
		const filtered = filter(options, params);

		if (params.inputValue !== "") {
			filtered.push({
				value: params.inputValue,
				title: `Add "${params.inputValue}"`,
			});
		}

		return filtered;
	};

	const handleAddIntentListener = () => {
		if (!intentListener) {
			setIntentError("Enter intent");
			return;
		} else {
			intentStore.addIntentListener(
				intentListener.value,
				toJS(resultTypeContext),
				currentAppChannelId,
				channelType === "private-channel",
				resultOverChannelContextList,
				resultOverChannelContextDelays
			);
			setIntentListener(null);
		}
		setSendIntentResult(false);
	};

	const handleChannelTypeChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
		setChannelType(nextView);
	};

	const clearTargets = () => {
		setTargetApp(null);
		setTargetOptions([]);
	};

	const clearContextTargets = () => {
		setContextTargetApp(null);
		setUseContextTargets(false);
		setTargetOptionsforContext([]);
	};

	const handleTargetToggle = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
		setUseTargets(checked);
		if (!checked) {
			clearTargets();
		}
	};

	const handleContextTargetToggle = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
		setUseContextTargets(checked);
		if (!checked) {
			clearContextTargets();
		}
	};

	const setChannelContextList = (context: ContextType, index: number) => {
		setResultOverChannelContextList((curr: any) => {
			return { ...curr, [index]: context };
		});
	};

	const setChannelContextDelay = (delay: string, index: number) => {
		setResultOverChannelContextDelays((curr: any) => {
			const lastDelay = curr[index - 1] || 0;
			return { ...curr, [index]: lastDelay + Number(delay) };
		});
	};

	const handleAddContextField = () => {
		setContextFields((current) => [
			...current,
			<Grid container direction="row" key={contextFields.length}>
				<Grid item className={classes.indentLeft}>
					<TextField
						variant="outlined"
						label="Delay (ms)"
						type="number"
						size="small"
						onChange={(e) => setChannelContextDelay(e.target.value, contextFields.length)}
					/>
				</Grid>
				<Grid item className={`${classes.indentLeft} ${classes.field}`}>
					<ContextTemplates
						handleTabChange={handleTabChange}
						contextStateSetter={(context: any) => setChannelContextList(context, contextFields.length)}
					/>
				</Grid>
			</Grid>,
		]);
	};

	useEffect(() => {
		setIntentValue(null);
		const fetchIntents = async () => {
			try {
				if (!raiseIntentContext) {
					return;
				}
				setRaiseIntentError(false);
				let appIntents = await fdc3.findIntentsByContext(toJS(raiseIntentContext));

				setUseTargets(false);
				clearTargets();

				if (appIntents.length > 0) {

					setCurrContextIntents(appIntents);
					
					setIntentsForContext(
						appIntents.map(({ intent }: { intent: any }) => {
							return {
								title: intent.name,
								value: intent.name,
							};
						})
					);
				}
			} catch (e) {
				setIntentsForContext([]);
				setRaiseIntentError("no intents found");
			}
		};
		fetchIntents();
	}, [raiseIntentContext]);

	useEffect(() => {
		if (!intentValue) {
			setUseTargets(false);
			clearTargets();
			return;
		}

		let foundIntent = currContextIntents.find((currIntent)=>currIntent.intent.name === intentValue?.value);
		if(!foundIntent?.apps) {
			setUseTargets(false);
			clearTargets();
			return;
		}

		let sortedApps: any[] = [];
		foundIntent.apps.forEach((currentApp)=>{
			let foundAppIndex = sortedApps.find((app)=>app.appId === currentApp.appId);
			if(!foundAppIndex) {
				if (!currentApp?.instanceId) {
					sortedApps.push({
						appId: currentApp.appId || currentApp.name,
						app: currentApp
					});
				} else {
					sortedApps.push({
						appId: currentApp.appId || currentApp.name,
						instances: [currentApp]
					});
				}
				
			}
			else {
				if (!currentApp.instanceId) {
					foundAppIndex.app = currentApp;
				} else {
					foundAppIndex.instances = foundAppIndex.instances ? foundAppIndex.instances.concat([currentApp]) : [currentApp];
				}
				
			}
		});
		const fullApps: any[] = [];
		sortedApps.map((appSet) => {
			if(!appSet.app){
				fullApps.push(
					<MenuItem value="" disabled>
						No Target Apps Found
					</MenuItem>
				);
			}
			if(appSet.app) {
				fullApps.push(
					<MenuItem key="" value="None">
						None
					</MenuItem>
				);
			}
			if(appSet.app && window.fdc3Version.includes("2.0")) {
				fullApps.push(
					<ListSubheader>Launch New: ({appSet.appId})</ListSubheader>
				);
			}

			fullApps.push(
			<MenuItem className="app" key={appSet?.app.appId || appSet?.app.name} value={JSON.stringify(appSet?.app)}>
				{appSet?.app.appId || appSet?.app.name}
			</MenuItem>
			);
			
			if(appSet.instances?.length && window.fdc3Version.includes("2.0")) {
				fullApps.push(<ListSubheader>Launch Existing: ({appSet.appId})</ListSubheader>);
			}
			appSet?.instances?.map((target: any) => {
				fullApps.push(
				<MenuItem className="instance" key={target.instanceId} value={JSON.stringify(target)}>
					{target.instanceId}
				</MenuItem>
				);
			});
			
		});
		setTargetOptions(fullApps);
	}, [intentValue]);

	useEffect(() => {
		const fetchIntents = async () => {
			if (!raiseIntentWithContextContext) {
				setUseContextTargets(false);
				clearContextTargets();
				return;
			}
			try {
				let appIntentsForContext = await fdc3.findIntentsByContext(toJS(raiseIntentWithContextContext)) || [];
				setUseContextTargets(false);
				clearContextTargets();
				if (!appIntentsForContext) {
					return;
				}				
				
				if (appIntentsForContext.length > 0) {

					let sortedIntents: any[] = [];
					
					appIntentsForContext.map((currentIntent)=>{
						let foundIntent = sortedIntents.find((currentLoopIntent)=>currentIntent.intent.name === currentLoopIntent.intent);
						if(!foundIntent) {
							let sortedApps: any[] = [];
							currentIntent.apps.forEach((currentApp: any)=>{
								let foundAppIndex = sortedApps.find((app)=>app.appId === currentApp.appId);
								if(!foundAppIndex) {
									if (!currentApp.instanceId) {
										sortedApps.push({
											appId: currentApp.appId || currentApp.name,
											app: currentApp
										});
									} else {
										sortedApps.push({
											appId: currentApp.appId || currentApp.name,
											instances: [currentApp]
										});
									}
								}
								else {
									if (!currentApp.instanceId) {
										foundAppIndex.app = currentApp;
									} else {
										foundAppIndex.instances = foundAppIndex.instances ? foundAppIndex.instances.concat([currentApp]) : [currentApp];
									}
								}
							});
							sortedIntents.push({intent: currentIntent.intent.name, sortedApps });
						}
					});
					
					const fullContextApps: any[] = [];
					let totalNumApps = 0;
					let totalNumInstances = 0;
					sortedIntents.map((sI: any)=>{
						totalNumApps = totalNumApps + (sI.sortedApps.length || 0);
						sI.sortedApps.map((sII: any)=>{
							totalNumInstances = totalNumInstances + ( sII.instances?.length || 0)
						});
					});
					if(totalNumApps > 0){
						fullContextApps.push(
							<MenuItem key="" value="None">
								None
							</MenuItem>
						);
					} else {
						fullContextApps.push(
							<MenuItem value="" disabled>
								No Target Apps Found
							</MenuItem>
						);
					}

					sortedIntents.map((currentSortedIntent)=>{
						currentSortedIntent.sortedApps.map((appSet: any)=>{
							if(appSet.app) {
								if( window.fdc3Version == "2.0") {
									fullContextApps.push(<ListSubheader>Launch new ({appSet.appId}):</ListSubheader>);
								}

								fullContextApps.push(
									<MenuItem value={JSON.stringify(appSet.app)} key={appSet.app.name}>
										{currentSortedIntent.intent} - {appSet.app.name}
									</MenuItem>
								);
								
							}

							if(appSet.instances?.length){
								if(window.fdc3Version == "2.0" ) {
									fullContextApps.push(<ListSubheader>Launch Existing: ({appSet.appId})</ListSubheader>);
								}
								appSet.instances.map((target: any) => {
									fullContextApps.push(<MenuItem key={target.instanceId} value={JSON.stringify(target)}>
										{currentSortedIntent.intent} - {target.instanceId}
									</MenuItem>);
								});	
							}												
						});
					})
					
					setTargetOptionsforContext(fullContextApps);
				}


			} catch (e) {
				setUseContextTargets(false);
				clearContextTargets();
				console.log(e);
			}
		};
		fetchIntents();
	}, [raiseIntentWithContextContext]);

	useEffect(() => {
		if (sendResultOverChannel) {
			handleAddContextField();
		} else {
			setContextFields([]);
		}
	}, [sendResultOverChannel]);

	return (
		<div className={classes.root}>
			<Grid item xs={12}>
				<Typography variant="h5">Raise Intent</Typography>
			</Grid>

			<form className={classes.form} noValidate autoComplete="off">
				<Grid container direction="row" spacing={2}>
					<Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
						<Grid item className={classes.field}>
							<ContextTemplates handleTabChange={handleTabChange} contextStateSetter={setRaiseIntentContext} />
							<Autocomplete
								className={classes.rightPadding}
								id="raise-intent"
								size="small"
								selectOnFocus
								blurOnSelect
								clearOnBlur
								handleHomeEndKeys
								value={intentValue}
								onChange={handleChangeListener(setIntentValue, setRaiseIntentError)}
								filterOptions={filterOptions}
								options={intentsForContext || intentListenersOptions}
								getOptionLabel={getOptionLabel}
								renderOption={(option) => option.title}
								renderInput={(params) => (
									<TemplateTextField
										label="INTENT TYPE"
										placeholder="Enter Intent Type"
										variant="outlined"
										{...params}
										error={!!raiseIntentError}
										helperText={raiseIntentError}
									/>
								)}
							/>
							<Grid className={classes.rightPadding}>
								<FormGroup>
									<FormControlLabel
										control={
											<Switch
												checked={useTargets}
												onChange={handleTargetToggle}
												color="primary"
												disabled={!intentValue}
											/>
										}
										label="Select Target"
									/>
								</FormGroup>

								{useTargets && (
									<FormControl variant="outlined" size="small" className={classes.targetSelect}>
										<InputLabel id="intent-target-app">Target App (optional)</InputLabel>
										<Select
											labelId="intent-target-app"
											id="intent-target-app-select"
											value={targetApp?.instanceId || targetApp?.appId }
											onChange={handleTargetChange}
											label="Target App (optional)"
											MenuProps={{
												anchorOrigin: {
													vertical: "bottom",
													horizontal: "left",
												},
												transformOrigin: {
													vertical: "top",
													horizontal: "left",
												},
												getContentAnchorEl: null,
											}}
										>
											{targetOptions}
										</Select>
									</FormControl>
								)}
							</Grid>
						</Grid>
						<Grid item className={classes.controls}>
							<Button variant="contained" color="primary" onClick={handleRaiseIntent} disabled={!raiseIntentContext}>
								Raise Intent
							</Button>

							<Tooltip title="Copy code example" aria-label="Copy code example">
								<IconButton
									size="small"
									aria-label="Copy code example"
									color="primary"
									onClick={() => {
										const context = JSON.stringify(raiseIntentContext, null, 2);
										const intent = String(intentValue);

										let exampleToUse = codeExamples.raiseIntent(context, intent);
										if (targetApp?.instanceId) {
											exampleToUse = codeExamples.raiseIntentInstance(context, intent);
										} else if (targetApp) {
											exampleToUse = codeExamples.raiseIntentTarget(context, intent);
										}
										copyToClipboard(exampleToUse, "raiseIntent")();
									}}
								>
									<FileCopyIcon />
								</IconButton>
							</Tooltip>

							<Link onClick={openApiDocsLink} target="FDC3APIDocs" href="https://fdc3.finos.org/docs/api/ref/DesktopAgent#raiseintent">
								<InfoOutlinedIcon />
							</Link>
						</Grid>
					</Grid>
					{intentResolution?.source && (
						<Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
							<Grid item className={classes.textField}>
								<IntentResolutionField data={intentResolution} handleTabChange={handleTabChange} />
							</Grid>
							<Grid item>
								<Button variant="contained" color="secondary" onClick={() => setIntentResolution(null)}>
									Clear result
								</Button>
							</Grid>
						</Grid>
					)}
					<div className={classes.border}></div>

					<Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
						<Grid item xs={12} className={classes.bottomMargin}>
							<Typography variant="h5">Raise Intent for Context</Typography>
						</Grid>
						<Grid item className={`${classes.field} ${classes.removeSidePadding}`}>
							<ContextTemplates
								handleTabChange={handleTabChange}
								contextStateSetter={setRaiseIntentWithContextContext}
							/>
							<Grid className={classes.rightPadding}>
								<FormGroup>
									<FormControlLabel
										control={
											<Switch checked={useContextTargets} color="primary" onChange={handleContextTargetToggle} />
										}
										label="Select Target"
										disabled={!raiseIntentWithContextContext || targetOptionsforContext.length < 1}
									/>
								</FormGroup>

								{useContextTargets && (
									<FormControl variant="outlined" size="small" className={classes.targetSelect}>
										<InputLabel id="intent-context-target-app">Target (optional)</InputLabel>
										<Select
											labelId="intent-context-target-app"
											id="intent-context-target-app-select"
											value={contextTargetApp?.instanceId || contextTargetApp?.appId}
											onChange={handleContextTargetChange}
											label="Target App (optional)"
											MenuProps={{
												anchorOrigin: {
													vertical: "bottom",
													horizontal: "left",
												},
												transformOrigin: {
													vertical: "top",
													horizontal: "left",
												},
												getContentAnchorEl: null,
											}}
										>
											{targetOptionsforContext}
										</Select>
									</FormControl>
								)}
							</Grid>
						</Grid>
						<Grid item className={classes.controls}>
							<Button
								disabled={!raiseIntentWithContextContext}
								variant="contained"
								color="primary"
								onClick={handleRaiseIntentForContext}
							>
								Raise intent for context
							</Button>

							<Tooltip title="Copy code example" aria-label="Copy code example">
								<IconButton
									size="small"
									aria-label="Copy code example"
									color="primary"
									onClick={() => {
										const context = JSON.stringify(raiseIntentWithContextContext, null, 2);
										let exampleToUse = codeExamples.raiseIntentForContext(context);
										if (contextTargetApp?.instanceId) {
											exampleToUse = codeExamples.raiseIntentForContextInstance(context);
										} else if (contextTargetApp) {
											exampleToUse = codeExamples.raiseIntentForContextTarget(context);
										}
										copyToClipboard(exampleToUse, "raiseIntentForContext")();
									}}
								>
									<FileCopyIcon />
								</IconButton>
							</Tooltip>

							<Link onClick={openApiDocsLink} target="FDC3APIDocs" href="https://fdc3.finos.org/docs/api/ref/DesktopAgent#raiseintentforcontext">
								<InfoOutlinedIcon />
							</Link>
						</Grid>
					</Grid>
					{intentForContextResolution?.source && (
						<Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
							<Grid item className={classes.textField}>
								<IntentResolutionField data={intentForContextResolution} handleTabChange={handleTabChange} />
							</Grid>
							<Grid item>
								<Button variant="contained" color="secondary" onClick={() => setIntentResolution(null)}>
									Clear result
								</Button>
							</Grid>
						</Grid>
					)}
					<div className={classes.border}></div>

					<Grid container item spacing={2} justifyContent="flex-end" className={classes.spread}>
						<Grid item xs={12}>
							<Typography className={classes.bottomMargin} variant="h5">
								Add Intent Listener
							</Typography>
						</Grid>
						<Grid item className={`${classes.field} ${classes.removeSidePadding}`}>
							<Autocomplete
								id="intent-listener"
								size="small"
								selectOnFocus
								blurOnSelect
								clearOnBlur
								handleHomeEndKeys
								value={intentListener}
								onChange={handleChangeListener(setIntentListener, setIntentError)}
								filterOptions={filterOptions}
								options={intentListenersOptions}
								getOptionLabel={getOptionLabel}
								renderOption={(option) => option.title}
								renderInput={(params) => (
									<TemplateTextField
										label="INTENT LISTENER"
										placeholder="Enter Intent Type"
										variant="outlined"
										{...params}
										error={!!intentError}
										helperText={intentError}
									/>
								)}
							/>
						</Grid>

						<Grid item className={classes.controls}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleAddIntentListener}
								disabled={intentListener === null}
							>
								Add Listener
							</Button>

							<Tooltip title="Copy code example" aria-label="Copy code example">
								<IconButton
									size="small"
									aria-label="Copy code example"
									color="primary"
									onClick={() => {
										let exampleToUse = codeExamples.intentListener;
										if (resultType === "context-result") {
											exampleToUse = codeExamples.intentListenerWithContextResult;
										} else if (resultType === "channel-result") {
											if (channelType === "app-channel") {
												exampleToUse = codeExamples.intentListenerWithAppChannel;
											} else {
												exampleToUse = codeExamples.intentListenerWithPrivateChannel;
											}
										}
										copyToClipboard(exampleToUse, "addIntentListener")();
									}}
								>
									<FileCopyIcon />
								</IconButton>
							</Tooltip>

							<Link onClick={openApiDocsLink} target="FDC3APIDocs" href="https://fdc3.finos.org/docs/api/ref/DesktopAgent#addintentlistener">
								<InfoOutlinedIcon />
							</Link>
						</Grid>
					</Grid>
					{window.fdc3Version === "2.0" && (
						<Grid item xs={12}>
							<FormGroup>
								<FormControlLabel
									control={
										<Checkbox
											className={classes.input}
											color="default"
											checked={sendIntentResult}
											onChange={(e) => setSendIntentResult(e.target.checked)}
										/>
									}
									label="Send Intent Result"
								/>
							</FormGroup>
						</Grid>
					)}
					{sendIntentResult && (
						<Grid item xs={12} className={classes.indentLeft}>
							<RadioGroup name="intent-result-type" value={resultType} onChange={(e) => setResultType(e.target.value)}>
								<FormControlLabel
									value="context-result"
									control={<Radio className={classes.input} />}
									label="Context result"
								/>
								{resultType === "context-result" && (
									<Grid item className={classes.indentLeft}>
										<ContextTemplates handleTabChange={handleTabChange} contextStateSetter={setResultTypeContext} />
									</Grid>
								)}
								<FormControlLabel
									value="channel-result"
									control={<Radio className={classes.input} />}
									label="Channel result"
								/>
								{resultType === "channel-result" && (
									<Grid item className={classes.indentLeft}>
										<ToggleButtonGroup
											value={channelType}
											exclusive
											onChange={handleChannelTypeChange}
											aria-label="result channel type"
										>
											<ToggleButton className={classes.toggle} value="app-channel" aria-label="left aligned">
												App Channel
											</ToggleButton>
											<ToggleButton className={classes.toggle} value="private-channel" aria-label="left aligned">
												Private Channel
											</ToggleButton>
										</ToggleButtonGroup>

										{channelType === "app-channel" && (
											<Grid item className={classes.field}>
												<TextField
													fullWidth
													variant="outlined"
													label="Channel Name"
													type="text"
													size="small"
													onChange={(e: any) => setCurrentAppChannelId(e.target.value)}
													value={currentAppChannelId}
												/>
											</Grid>
										)}
										<FormGroup>
											{channelType === "private-channel" && (
												<Typography variant="caption" className={classes.caption}>
													Context streaming will start AFTER a context listener is added to the channel
												</Typography>
											)}
											<FormControlLabel
												control={
													<Checkbox
														className={classes.input}
														color="default"
														checked={sendResultOverChannel}
														onChange={(e) => setSendResultOverChannel(e.target.checked)}
													/>
												}
												label="Send context result over channel"
											/>
										</FormGroup>
										{sendResultOverChannel && (
											<>
												{contextFields.map((field, index) => (
													<React.Fragment key={index}>{field}</React.Fragment>
												))}
												<Grid item className={classes.indentLeft}>
													<Tooltip
														title="Add context result (delays will trigger sequentially)"
														aria-label="Add context result (delays will trigger sequentially)"
													>
														<IconButton
															size="small"
															aria-label="Add context result (delays will trigger sequentially)"
															color="primary"
															onClick={handleAddContextField}
														>
															<AddCircleOutlineIcon />
														</IconButton>
													</Tooltip>

													<Link
														target="FDC3APIDocs"
														href="https://fdc3.finos.org/docs/api/ref/DesktopAgent#addintentlistener"
													>
														<InfoOutlinedIcon />
													</Link>
												</Grid>
											</>
										)}
									</Grid>
								)}
							</RadioGroup>
						</Grid>
					)}
				</Grid>
			</form>
		</div>
	);
});
