/**
 * Copyright 2023 Hasnae Rehioui
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ClassicLevel } from 'classic-level';

import type { Filter, Identifiable, Registry } from './types';

export * from './types';

export type RegistryInfo = {
    localPath: string;
};

export const leveldbRegistry = <TItem extends Identifiable>({
    localPath
}: RegistryInfo): Registry<TItem> => {
    const withLeveldb = async <T>(
        fn: (s: ClassicLevel<string, string>) => Promise<T>
    ): Promise<T> => {
        const db = new ClassicLevel<string, string>(localPath);
        const result = await fn(db);
        await db.close();
        return result;
    };

    const add = async (item: TItem): Promise<TItem> => {
        return withLeveldb<TItem>(async (r) => {
            await r.put(item.id, JSON.stringify(item));
            return item;
        });
    };

    const remove = async (id: string): Promise<TItem | undefined> => {
        return withLeveldb<TItem>(async (r) => {
            const value = await r.get(id);
            const found = value === undefined ? undefined : JSON.parse(value);
            await r.del(id);
            return found;
        });
    };

    const fetch = async (id: string): Promise<TItem | undefined> => {
        return withLeveldb<TItem>(async (r) => {
            const value = await r.get(id);
            return value === undefined ? undefined : JSON.parse(value);
        });
    };

    const list = async (
        filter: Filter<TItem> = () => true
    ): Promise<TItem[]> => {
        return withLeveldb<TItem[]>(async (r) => {
            const items: TItem[] = [];
            for await (const value of r.values()) {
                const item = JSON.parse(value) as TItem;
                if (filter(item)) items.push(item);
            }
            return items;
        });
    };

    const ids = async (): Promise<string[]> => {
        return withLeveldb<string[]>(async (r) => {
            const keys: string[] = [];
            for await (const key of r.keys()) {
                keys.push(key);
            }
            return keys;
        });
    };

    return { add, remove, fetch, list, ids };
};
