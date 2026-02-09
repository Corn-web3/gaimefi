import { useEffect, useRef, useState } from "react";

export const useInfiniteScroll = ({
  api,
  size = 10,
  params,
  defalutPageNum = 1,
  defaultList = [],
  type = "defalut",
  containerRef,
  open = true,
}) => {
  const [page, setPage] = useState(defalutPageNum);
  const [total, setTotal] = useState(-1);
  const [pageSize, setPageSize] = useState(size);
  const [list, setList] = useState<any[]>(defaultList);
  const [loading, setLoading] = useState(false);
  const [reflash, setReflash] = useState(0);
  const ref = useRef<any>();
  const listRef = useRef<any>();
  const openRef = useRef<any>(open);
  const firstRef = useRef<any>(true);

  const nextPage = () => {
    if (total >= 0 && Math.ceil(total / pageSize) < page + 1) {
      return;
    }
    setPage(page + 1);
  };
  ref.current = { nextPage };

  const handleScroll = () => {
    const container = containerRef?.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const zoomLevel = window.devicePixelRatio;
    const tolerance = zoomLevel > 1 ? 10 : 0; // Adjust tolerance based on zoom level

    if (scrollTop + clientHeight >= scrollHeight - tolerance) {
      ref.current?.nextPage();
    }
  };

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [containerRef?.current]);

  const getList = async () => {
    if (!openRef.current) {
      return;
    }
    setLoading(true);
    const { data, extra } = await api({
      page,
      pageSize,
      ...params,
    }).finally(() => {
      setLoading(false);
    });
    setTotal(extra?.count);
    if (type === "default") {
      setList(data);
      listRef.current = data;
    }
    if (type === "add") {
      if (page === 1) {
        setList(data);
        listRef.current = data;
      } else {
        setList((prevList) => [...prevList, ...data]);
        listRef.current = [...listRef.current, ...data];
      }
    }
  };

  useEffect(() => {
    if (list?.length > 0) {
      handleScroll();
    }
  }, [list]);

  const reset = () => {
    listRef.current = [];
    setList([]);
    setPage(1);
    setTotal(-1);
    setReflash(Math.random());
  };

  useEffect(() => {
    listRef.current = [];
    setList([]);
    setPage(1);
    setTotal(-1);
    if (!firstRef.current) {
      setReflash(Math.random());
    }
  }, [params]);

  useEffect(() => {
    firstRef.current = false;
    getList();
  }, [page, reflash]);

  return {
    total,
    more: page * pageSize < total,
    loading,
    list,
    page,
    prevPage: () => {
      if (page === 0) {
        return;
      }
      setPage(page - 1);
    },
    nextPage,
    setPage,
    setPageSize,
    reflash: getList,
    reset,
  };
};
