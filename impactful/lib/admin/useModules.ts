"use client";

import { useCallback, useEffect, useState } from "react";
import {
	deleteModule,
	duplicateModule,
	ensureSeededModules,
	getModuleById,
	listModules,
	saveModule,
	setModuleStatus,
} from "./repository";
import type { LearningModule, LearningModuleStatus } from "./types";

export function useModules() {
	const [modules, setModules] = useState<LearningModule[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const refresh = useCallback(() => {
		setModules(listModules());
	}, []);

	useEffect(() => {
		ensureSeededModules();
		const timer = window.setTimeout(() => {
			refresh();
			setIsLoading(false);
		}, 0);

		return () => {
			window.clearTimeout(timer);
		};
	}, [refresh]);

	const save = useCallback((module: LearningModule) => {
		saveModule(module);
		refresh();
	}, [refresh]);

	const remove = useCallback((moduleId: string) => {
		deleteModule(moduleId);
		refresh();
	}, [refresh]);

	const duplicate = useCallback((moduleId: string) => {
		const created = duplicateModule(moduleId);
		refresh();
		return created;
	}, [refresh]);

	const setStatus = useCallback((moduleId: string, status: LearningModuleStatus) => {
		setModuleStatus(moduleId, status);
		refresh();
	}, [refresh]);

	return {
		modules,
		isLoading,
		refresh,
		save,
		remove,
		duplicate,
		setStatus,
	};
}

export function useModuleById(moduleId: string | null) {
	const [module, setModule] = useState<LearningModule | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refresh = useCallback(() => {
		if (!moduleId) {
			setModule(null);
			return;
		}

		setModule(getModuleById(moduleId));
	}, [moduleId]);

	useEffect(() => {
		ensureSeededModules();
		const timer = window.setTimeout(() => {
			refresh();
			setIsLoading(false);
		}, 0);

		return () => {
			window.clearTimeout(timer);
		};
	}, [refresh]);

	return {
		module,
		isLoading,
		refresh,
	};
}
