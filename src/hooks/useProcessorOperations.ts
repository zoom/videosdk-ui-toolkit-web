import React, { useContext } from "react";
import { StreamContext } from "../context/stream-context";
import { ProcessorConfig, ProcessorType } from "../types/processor";
import { useAppDispatch, useAppSelector, useSessionUISelector } from "./useAppSelector";
import { addActiveProcessor, removeActiveProcessor, setProcessorLoading } from "../store/uiSlice";

// Global processor instance cache that persists across component unmounts
const globalProcessorInstances = new Map<string, any>();

export const useProcessorOperations = (type: ProcessorType) => {
  const { stream } = useContext(StreamContext);
  const dispatch = useAppDispatch();
  const { activeProcessors, loadingProcessors } = useAppSelector(useSessionUISelector);

  const [createdProcessors, setCreatedProcessors] = React.useState<Map<string, any>>(new Map());

  const handleAddProcessor = async (processorConfig: ProcessorConfig) => {
    if (!stream) {
      // eslint-disable-next-line no-console
      console.error("Stream not available");
      return;
    }

    dispatch(setProcessorLoading({ name: processorConfig.name, loading: true }));
    try {
      const processorKey = `${processorConfig.name}-${processorConfig.type}`;
      let processor = createdProcessors.get(processorKey) || globalProcessorInstances.get(processorKey);

      if (!processor) {
        processor = await stream.createProcessor({
          name: processorConfig.name,
          type: processorConfig.type,
          url: processorConfig.url,
          options: processorConfig.options || {},
        });

        if (!processor) {
          throw new Error("Failed to create processor - no processor returned");
        }

        setCreatedProcessors((prev) => new Map(prev).set(processorKey, processor));
        globalProcessorInstances.set(processorKey, processor);
      }

      await stream.addProcessor(processor);
      dispatch(addActiveProcessor({ name: processorConfig.name, type: processorConfig.type }));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(`[${type}] Failed to start processor:`, error);
    } finally {
      dispatch(setProcessorLoading({ name: processorConfig.name, loading: false }));
    }
  };

  const handleRemoveProcessor = async (processorName: string) => {
    if (!stream) return;
    dispatch(setProcessorLoading({ name: processorName, loading: true }));

    try {
      const processor = await getActiveProcessorInstance(processorName);
      if (processor) {
        const result = await stream.removeProcessor(processor);
        if (result && typeof result === "object") {
          // eslint-disable-next-line no-console
          console.error(`[${type}] Failed to stop processor:`, result);
        }
      }

      // Always clean up Redux state
      dispatch(removeActiveProcessor({ name: processorName, type }));
      // Note: We DON'T delete from globalProcessorInstances to allow reuse
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`[${type}] Failed to stop processor:`, error);
      // Clean up Redux state even on error
      dispatch(removeActiveProcessor({ name: processorName, type }));
    } finally {
      dispatch(setProcessorLoading({ name: processorName, loading: false }));
    }
  };
  const getActiveProcessorInstance = async (processorName: string) => {
    const processorKey = `${processorName}-${type}`;
    const processor = createdProcessors.get(processorKey) || globalProcessorInstances.get(processorKey);
    return processor || null;
  };
  const isActive = (processorName: string) => {
    return activeProcessors.some((p) => p.name === processorName && p.type === type);
  };
  const hasActiveProcessor = () => {
    return activeProcessors.some((p) => p.type === type);
  };
  const isLoading = (processorName: string) => {
    return loadingProcessors.includes(processorName);
  };
  return {
    handleAddProcessor,
    handleRemoveProcessor,
    getActiveProcessorInstance,
    isActive,
    hasActiveProcessor,
    isLoading,
  };
};
