const privateResolver = resolverFunction => async (
  parent,
  args,
  context,
  info
) => {
  if (!context.req.user) {
    throw new Error("No JWT, I  refuse to proceed");
  }
  const resolved = await resolverFunction(parent, args, context, info);
  return resolved;
};

export default privateResolver;

// graphql에 의해 privateResolver를 호출 할 때  parent, args, context, info argument와 같이 호출됨
