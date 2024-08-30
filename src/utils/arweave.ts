import { useContext, useEffect, useState } from 'react';
import { type Tag } from 'arweave/web/lib/transaction';
import { ConfigContext } from '../contexts/config';
import Arweave from 'arweave';

let arweave: Arweave | null = null;

/**
 * Get arweave instance
 */
export const getArweave = () => {
    if (arweave === null) arweave = Arweave.init({});

    return arweave;
};

/**
 * Find the value for a tag name
 */
export const getTagValue = (tagName: string, tags: Tag[]) =>
    tags.find((t) => t.name === tagName)?.value;

/**
 * Load an image from the permaweb
 */
export function useImage(txID?: string): [string | undefined, boolean] {
    // image object url
    const [image, setImage] = useState<string>();

    // loading image
    const [loading, setLoading] = useState(true);

    // config
    const [config] = useContext(ConfigContext);

    // load token logo to an object url to fix flickering
    useEffect(() => {
        (async () => {
            if (!txID) {
                return setImage(undefined);
            }
            setLoading(true);

            try {
                const res = await (
                    await fetch(`${config.GATEWAY_URL}/${txID}`)
                ).blob();

                setImage(URL.createObjectURL(res));
            } catch {
                /* empty */
            }

            setLoading(false);
        })();
    }, [txID, config.GATEWAY_URL]);

    return [image, loading];
}
