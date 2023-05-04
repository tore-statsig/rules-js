import DynamicConfig from './DynamicConfig';
import { StatsigUninitializedError } from './Errors';
import Layer from './Layer';
import StatsigClient, { StatsigOverrides } from './StatsigClient';
import { StatsigOptions } from './StatsigSDKOptions';
import { EvaluationDetails, EvaluationReason } from './StatsigStore';
import { StatsigUser } from './StatsigUser';

export { default as DynamicConfig } from './DynamicConfig';
export { default as Layer } from './Layer';
export {
  default as StatsigClient,
  IStatsig,
  StatsigOverrides,
} from './StatsigClient';
export type {
  AppState,
  AppStateEvent,
  AppStateStatus,
  _SDKPackageInfo as _SDKPackageInfo,
} from './StatsigClient';
export type {
  DeviceInfo,
  ExpoConstants,
  ExpoDevice,
  NativeModules,
  Platform,
} from './StatsigIdentity';
export { StatsigEnvironment, StatsigOptions } from './StatsigSDKOptions';
export type {
  InitCompletionCallback,
  UpdateUserCompletionCallback,
} from './StatsigSDKOptions';
export { EvaluationReason } from './StatsigStore';
export type { EvaluationDetails } from './StatsigStore';
export { StatsigUser } from './StatsigUser';

export default class Statsig {
  private static instance: StatsigClient | null = null;

  private constructor() {}

  public static async initialize(
    sdkKey: string,
    user?: StatsigUser | null,
    options?: StatsigOptions | null,
  ): Promise<void> {
    const inst = Statsig.instance ?? new StatsigClient(sdkKey, user, options);

    if (!Statsig.instance) {
      Statsig.instance = inst;
    }

    return inst.initializeAsync();
  }

  public static setInitializeValues(
    initializeValues: Record<string, unknown>,
  ): void {
    Statsig.getClientX().setInitializeValues(initializeValues);
  }

  public static checkGate(
    gateName: string,
    ignoreOverrides: boolean = false,
  ): boolean {
    return Statsig.getClientX().checkGate(gateName, ignoreOverrides);
  }

  public static checkGateWithExposureLoggingDisabled(
    gateName: string,
    ignoreOverrides: boolean = false,
  ): boolean {
    return Statsig.getClientX().checkGateWithExposureLoggingDisabled(
      gateName,
      ignoreOverrides,
    );
  }

  public static manuallyLogGateExposure(gateName: string) {
    Statsig.getClientX().logGateExposure(gateName);
  }

  public static getConfig(
    configName: string,
    ignoreOverrides: boolean = false,
  ): DynamicConfig {
    return Statsig.getClientX().getConfig(configName, ignoreOverrides);
  }

  public static getConfigWithExposureLoggingDisabled(
    configName: string,
    ignoreOverrides: boolean = false,
  ): DynamicConfig {
    return Statsig.getClientX().getConfigWithExposureLoggingDisabled(
      configName,
      ignoreOverrides,
    );
  }

  public static manuallyLogConfigExposure(configName: string) {
    Statsig.getClientX().logConfigExposure(configName);
  }

  public static getExperiment(
    experimentName: string,
    keepDeviceValue: boolean = false,
    ignoreOverrides: boolean = false,
  ): DynamicConfig {
    return Statsig.getClientX().getExperiment(
      experimentName,
      keepDeviceValue,
      ignoreOverrides,
    );
  }

  public static getExperimentWithExposureLoggingDisabled(
    experimentName: string,
    keepDeviceValue: boolean = false,
    ignoreOverrides: boolean = false,
  ): DynamicConfig {
    return Statsig.getClientX().getExperimentWithExposureLoggingDisabled(
      experimentName,
      keepDeviceValue,
      ignoreOverrides,
    );
  }

  public static manuallyLogExperimentExposure(
    configName: string,
    keepDeviceValue: boolean = false,
  ) {
    Statsig.getClientX().logExperimentExposure(configName, keepDeviceValue);
  }

  public static getLayer(
    layerName: string,
    keepDeviceValue: boolean = false,
  ): Layer {
    return Statsig.getClientX().getLayer(layerName, keepDeviceValue);
  }

  public static getLayerWithExposureLoggingDisabled(
    layerName: string,
    keepDeviceValue: boolean = false,
  ): Layer {
    return Statsig.getClientX().getLayerWithExposureLoggingDisabled(
      layerName,
      keepDeviceValue,
    );
  }

  public static manuallyLogLayerParameterExposure(
    layerName: string,
    parameterName: string,
    keepDeviceValue: boolean = false,
  ) {
    Statsig.getClientX().logLayerParameterExposure(
      layerName,
      parameterName,
      keepDeviceValue,
    );
  }

  public static logEvent(
    eventName: string,
    value: string | number | null = null,
    metadata: Record<string, string> | null = null,
  ): void {
    return Statsig.getClientX().logEvent(eventName, value, metadata);
  }

  public static updateUser(user: StatsigUser | null): Promise<boolean> {
    return Statsig.getClientX().updateUser(user);
  }

  public static shutdown() {
    Statsig.getClientX().shutdown();
    Statsig.instance = null;
  }

  /**
   * @returns The Statsig stable ID used for device level experiments
   */
  public static getStableID(): string {
    return Statsig.getClientX().getStableID();
  }

  /**
   *
   * @returns The reason and time associated with the evaluation for the current set
   * of gates and configs
   */
  public static getEvaluationDetails(): EvaluationDetails {
    return (
      Statsig.instance?.getEvaluationDetails() ?? {
        reason: EvaluationReason.Uninitialized,
        time: 0,
      }
    );
  }

  /**
   *
   * @returns true if initialize has already been called, false otherwise
   */
  public static initializeCalled(): boolean {
    return Statsig.instance != null && Statsig.instance.initializeCalled();
  }

  private static getClientX(): StatsigClient {
    if (!Statsig.instance) {
      throw new StatsigUninitializedError();
    }
    return Statsig.instance;
  }
}
