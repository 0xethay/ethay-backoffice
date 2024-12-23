/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface VerifyWorldIDInterface extends Interface {
  getFunction(
    nameOrSignature: "isVerifiedHuman" | "verifyHuman"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "Verified"): EventFragment;

  encodeFunctionData(
    functionFragment: "isVerifiedHuman",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "verifyHuman",
    values: [AddressLike, BigNumberish, BigNumberish, BigNumberish[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "isVerifiedHuman",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verifyHuman",
    data: BytesLike
  ): Result;
}

export namespace VerifiedEvent {
  export type InputTuple = [nullifierHash: BigNumberish];
  export type OutputTuple = [nullifierHash: bigint];
  export interface OutputObject {
    nullifierHash: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface VerifyWorldID extends BaseContract {
  connect(runner?: ContractRunner | null): VerifyWorldID;
  waitForDeployment(): Promise<this>;

  interface: VerifyWorldIDInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  isVerifiedHuman: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  verifyHuman: TypedContractMethod<
    [
      signal: AddressLike,
      root: BigNumberish,
      nullifierHash: BigNumberish,
      proof: BigNumberish[]
    ],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "isVerifiedHuman"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "verifyHuman"
  ): TypedContractMethod<
    [
      signal: AddressLike,
      root: BigNumberish,
      nullifierHash: BigNumberish,
      proof: BigNumberish[]
    ],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "Verified"
  ): TypedContractEvent<
    VerifiedEvent.InputTuple,
    VerifiedEvent.OutputTuple,
    VerifiedEvent.OutputObject
  >;

  filters: {
    "Verified(uint256)": TypedContractEvent<
      VerifiedEvent.InputTuple,
      VerifiedEvent.OutputTuple,
      VerifiedEvent.OutputObject
    >;
    Verified: TypedContractEvent<
      VerifiedEvent.InputTuple,
      VerifiedEvent.OutputTuple,
      VerifiedEvent.OutputObject
    >;
  };
}
